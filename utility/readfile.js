const XLSX = require('xlsx');
const fs = require('fs');

function uploadRecieve(filepath) {
    const workbook = XLSX.readFile(filepath);

    // Dapatkan nama semua sheet
    const sheetNames = workbook.SheetNames;

    // Ambil data dari sheet pertama
    const firstSheet = workbook.Sheets[sheetNames[0]];

    // Ubah data menjadi format JSON
    let jsonData = XLSX.utils.sheet_to_json(firstSheet);
    // Lakukan apa pun yang perlu dilakukan dengan data di bawah baris ini
    // Contoh: Menambahkan data ke database, memproses data, dll.

    return jsonData;
}

// fungsi untuk summary single/many data
function excelReadFile(datas) {
    // ! fungsi query semua data

    const data = keteranganTime(datas);
    const nameSorted = groupDataByTanggal(data);
    const filteredKeterangan = filterStatus(nameSorted);
    const selisihCounted = hitungSelisihJamMenit(filteredKeterangan);
    const arrayOfObj = Object.entries(selisihCounted).map((e) => ({
        [e[0]]: e[1], // berfungsi untuk menjadikan array of object
    }));

    const unCountedData = jumlahkanData(arrayOfObj);
    const summary = convertSummaryToArray(unCountedData);
    return summary;
}

function convertSummaryToArray(data) {
    let result = [];
    for (let name in data) {
        let tempObj = { nama: name };
        Object.assign(tempObj, data[name]);
        result.push(tempObj);
    }
    return result;
}

function dayDetail(datas) {
    // * pengolahan data
    const data = keteranganTime(datas);
    const nameSorted = groupDataByTanggal(data);
    const filteredKeterangan = filterStatus(nameSorted);
    const selisihCounted = hitungSelisihJamMenit(filteredKeterangan);
    // * pengolahan data

    // * remove first object
    const objKeys = Object.keys(selisihCounted);
    const namaAsisten = objKeys[0];
    const getData = selisihCounted[namaAsisten];
    // * remove first object

    // * rubah object ke array of object
    const detailData = convertToArrayOfObjects(getData);

    return detailData;
}

function convertToArrayOfObjects(data) {
    let result = [];
    for (let key in data) {
        let tempObj = { tanggal: key };
        data[key].forEach((item, idx) => {
            for (let prop in item) {
                tempObj[`${prop}${idx + 1}`] = item[prop];
            }
        });
        result.push(tempObj);
    }
    return result;
}

function timeFormat(time) {
    const timeInExcelFormat = time;
    const totalSeconds = Math.floor(timeInExcelFormat * 24 * 60 * 60);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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

            const inData = statusData.filter(
                (item) => item.keterangan === 'in'
            );
            const outData = statusData.filter(
                (item) => item.keterangan === 'out'
            );

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
                statusData[0].keterangan === 'in' &&
                statusData[1].keterangan === 'out'
            ) {
                const waktuIn = new Date(`2000-01-01T${statusData[0].waktu}`);
                const waktuOut = new Date(`2000-01-01T${statusData[1].waktu}`);
                const selisih = waktuOut - waktuIn;
                const jam = Math.floor(selisih / (1000 * 60 * 60));
                const menit = Math.floor(
                    (selisih % (1000 * 60 * 60)) / (1000 * 60)
                );
                const selisihFormat = `${jam
                    .toString()
                    .padStart(2, '0')}.${menit.toString().padStart(2, '0')}`;

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

        let lain_lain = '';

        Object.keys(aktivitas).forEach((key) => {
            aktivitas[key].forEach((info) => {
                for (const k in info) {
                    if (k === 'halaman_kunci') {
                        total_halaman_kunci += info[k];
                    } else if (k === 'halaman_ketik') {
                        total_halaman_ketik += info[k];
                    } else if (k === 'selisih') {
                        total_selisih += parseFloat(info[k]);
                    } else if (k === 'lain_lain') {
                        lain_lain += ', ' + info[k];
                    } else if (k === 'quiziz') {
                        // Menambahkan kondisi untuk quiziz
                        total_quiziz += info[k];
                    } else if (k === 'siswa') {
                        // Menambahkan kondisi untuk quiziz
                        total_siswa += info[k];
                    }
                }
            });
        });

        hasil[nama] = {
            jumlah_masuk: jumlah_masuk,
            jam_kerja: Math.ceil(total_selisih),
            siswa: total_siswa,
            halaman_ketik: total_halaman_ketik,
            halaman_kunci: total_halaman_kunci,
            quiziz: total_quiziz, // Menambah properti quiziz
            // lain_lain: lain_lain.slice(2),
        };
    });

    return hasil;
}

function detailAsisten(namaAsisten) {
    const dataPengajar = loadDataPengajar();
    const persons = excelReadFile(dataPengajar);
    return persons[namaAsisten];
}

const loadDataPengajar = () => {
    // mengambil data dari modal, dan dirubah menjadi JSON
    const filePath = './modal/datas.json';
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const unFilteredDatas = JSON.parse(jsonData);

    // filter nama yang undefined
    const datas = unFilteredDatas.filter((data) => {
        return data.nama !== undefined;
    });

    return datas;
};

module.exports = {
    excelReadFile,
    detailAsisten,
    uploadRecieve,
    loadDataPengajar,
    dayDetail,
};
