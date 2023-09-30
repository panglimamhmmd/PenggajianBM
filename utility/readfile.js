const XLSX = require("xlsx");
// Baca file Excel
const workbook = XLSX.readFile("absen.xlsx");
// Dapatkan nama semua sheet
const sheetNames = workbook.SheetNames;
// Ambil data dari sheet pertama
const firstSheet = workbook.Sheets[sheetNames[0]];
// Ubah data menjadi format JSON
const jsonData = XLSX.utils.sheet_to_json(firstSheet);
// Inisialisasi array untuk menyimpan data sebagai objek
const arrayOfObjects = [];

function excelReadFile() {
  jsonData.forEach((row) => {
    const obj = {};
    Object.keys(row).forEach((key) => {
      // Gunakan key sebagai nama properti dalam objek
      obj[key] = row[key];
    });
    arrayOfObjects.push(obj);
  });
  const blankNameFilter = arrayOfObjects.filter((item) => item.nama);

  const data = keteranganTime(blankNameFilter);
  const nameSorted = groupDataByTanggal(data);
  const filteredKeterangan = filterStatus(nameSorted);
  const selisihCounted = hitungSelisihJamMenit(filteredKeterangan);

  const arrayOfObj = Object.entries(selisihCounted).map((e) => ({
    [e[0]]: e[1], // berfungsi untuk menjadikan array of object
  }));

  const unCountedData = jumlahkanData(arrayOfObj);
  return unCountedData;
}

function timeFormat(time) {
  const timeInExcelFormat = time;
  const totalSeconds = Math.floor(timeInExcelFormat * 24 * 60 * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  return formattedTime;
}

function keteranganTime(arr) {
  return arr.map((data) => {
    return {
      ...data,
      waktu: timeFormat(data.waktu),
    };
  });
}

function groupDataByTanggal(data) {
  const groupedData = {};

  data.forEach((item) => {
    const { nama, tanggal, ...rest } = item;
    if (!groupedData[nama]) {
      groupedData[nama] = {};
    }
    if (!groupedData[nama][tanggal]) {
      groupedData[nama][tanggal] = [rest];
    } else {
      groupedData[nama][tanggal].push(rest);
    }
  });

  return groupedData;
}

function filterStatus(data) {
  const newData = {};

  for (const nama in data) {
    const dateData = data[nama];
    const filteredData = {};

    for (const tanggal in dateData) {
      const statusData = dateData[tanggal];

      const inData = statusData.filter((item) => item.keterangan === "in");
      const outData = statusData.filter((item) => item.keterangan === "out");

      if (inData.length > 1) {
        inData.sort((a, b) => new Date(a.status) - new Date(b.status));
        filteredData[tanggal] = [inData[0]];
      } else {
        filteredData[tanggal] = inData;
      }

      if (outData.length > 1) {
        outData.sort((a, b) => new Date(b.status) - new Date(a.status));
        if (filteredData[tanggal]) {
          filteredData[tanggal].push(outData[0]);
        } else {
          filteredData[tanggal] = [outData[0]];
        }
      } else if (outData.length === 1) {
        if (filteredData[tanggal]) {
          filteredData[tanggal].push(outData[0]);
        } else {
          filteredData[tanggal] = [outData[0]];
        }
      }
    }

    // Aturan tambahan: Cek apakah terdapat sepasang in-out dalam satu hari
    for (const tanggal in filteredData) {
      if (filteredData[tanggal].length !== 2) {
        delete filteredData[tanggal];
      }
    }

    newData[nama] = filteredData;
  }

  return newData;
}

function hitungSelisihJamMenit(data) {
  const selisihJamMenit = {};

  for (const nama in data) {
    const dateData = data[nama];
    const newData = {};

    for (const tanggal in dateData) {
      const statusData = dateData[tanggal];

      // Copy data sebelumnya ke newData
      newData[tanggal] = statusData.map((item) => ({ ...item }));

      if (
        statusData.length === 2 &&
        statusData[0].keterangan === "in" &&
        statusData[1].keterangan === "out"
      ) {
        const waktuIn = new Date(`2000-01-01T${statusData[0].waktu}`);
        const waktuOut = new Date(`2000-01-01T${statusData[1].waktu}`);
        const selisih = waktuOut - waktuIn;
        const jam = Math.floor(selisih / (1000 * 60 * 60));
        const menit = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
        const selisihFormat = `${jam.toString().padStart(2, "0")}.${menit
          .toString()
          .padStart(2, "0")}`;

        // Tambahkan properti selisih ke newData
        newData[tanggal].push({ selisih: selisihFormat });
      }
    }

    selisihJamMenit[nama] = newData;
  }

  return selisihJamMenit;
}

function jumlahkanData(data) {
  let hasil = {};

  data.forEach((item) => {
    const nama = Object.keys(item)[0];
    const aktivitas = item[nama];

    let total_halaman_kunci = 0;
    let total_halaman_ketik = 0;
    let total_selisih = 0;
    let jumlah_masuk = Object.keys(aktivitas).length; // Menghitung jumlah masuk
    let total_siswa = 0;
    let total_quiziz = 0; // Menambah variabel untuk menghitung total quiziz

    let lain_lain = "";

    Object.keys(aktivitas).forEach((key) => {
      aktivitas[key].forEach((info) => {
        for (const k in info) {
          if (k === "halaman_kunci") {
            total_halaman_kunci += info[k];
          } else if (k === "halaman_ketik") {
            total_halaman_ketik += info[k];
          } else if (k === "selisih") {
            total_selisih += parseFloat(info[k]);
          } else if (k === "lain_lain") {
            lain_lain += ", " + info[k];
          } else if (k === "quiziz") {
            // Menambahkan kondisi untuk quiziz
            total_quiziz += info[k];
          } else if (k === "siswa") {
            // Menambahkan kondisi untuk quiziz
            total_siswa += info[k];
          }
        }
      });
    });

    hasil[nama] = {
      halaman_kunci: total_halaman_kunci,
      halaman_ketik: total_halaman_ketik,
      jam_kerja: total_selisih.toFixed(2),
      lain_lain: lain_lain.slice(2),
      jumlah_masuk: jumlah_masuk,
      quiziz: total_quiziz, // Menambah properti quiziz
      siswa: total_siswa,
    };
  });

  return hasil;
}

function detailAsisten(namaAsisten) {
  const persons = excelReadFile();
  return persons[namaAsisten];
}

module.exports = { excelReadFile, detailAsisten };
