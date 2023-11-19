const XLSX = require('xlsx');

// mengambil nilai bulan yang ada pada data
const readMonth = (datas) => {
    const uniqueMonths = [];
    // Loop melalui setiap entri datas
    for (const entry of datas) {
        // Konversi tanggal menjadi objek JavaScript
        const dateObject = XLSX.SSF.parse_date_code(entry.tanggal);
        // Dapatkan nilai bulan dan tahun
        const month = dateObject.m; // Ingat bahwa nilai bulan dimulai dari 0
        // Buat kunci unik untuk setiap bulan dan tahun
        const key = month;
        // Periksa apakah kunci sudah ada dalam objek uniqueMonths
        if (!uniqueMonths.includes(key)) {
            // Jika belum, tambahkan ke array
            uniqueMonths.push(key);
        }
    }
    return uniqueMonths;
};

// mengumpulkan data berdasarkan bulan
const sortByMonth = (datas, month) => {
    const monthSorted = [];
    datas.forEach((data) => {
        // mendapatkan bulan pada data
        const dateObject = XLSX.SSF.parse_date_code(data.tanggal);
        const objectMonth = dateObject.m;

        if (objectMonth == month) {
            monthSorted.push(data);
        }
    });

    return monthSorted;
};

// mengambil nilai nama yang ada pada data
const readName = (datas) => {
    const uniqueName = [];
    // Loop melalui setiap entri datas
    datas.forEach((data) => {
        const namaPengajar = data.nama;

        if (!uniqueName.includes(namaPengajar)) {
            // Jika belum, tambahkan ke array
            uniqueName.push(namaPengajar);
        }
    });
    return uniqueName;
};

// filter data sesuai nama
const sortByName = (datas, nama) => {
    const dataByName = [];
    datas.forEach((data) => {
        const namaObject = data.nama;
        if (namaObject.toLowerCase() == nama.toLowerCase()) {
            dataByName.push(data);
        }
    });
    return dataByName;
};

module.exports = {
    readMonth,
    sortByMonth,
    readName,
    sortByName,
};
