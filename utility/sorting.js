const XLSX = require('xlsx');

// mengambil nilai bulan yang ada pada data
const readMonth = (datas) => {
    const nameOfMonth = [];
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

function getMonthName(number) {
    return number === 1
        ? 'Januari'
        : number === 2
        ? 'Februari'
        : number === 3
        ? 'Maret'
        : number === 4
        ? 'April'
        : number === 5
        ? 'Mei'
        : number === 6
        ? 'Juni'
        : number === 7
        ? 'Juli'
        : number === 8
        ? 'Agustus'
        : number === 9
        ? 'September'
        : number === 10
        ? 'Oktober'
        : number === 11
        ? 'November'
        : number === 12
        ? 'Desember'
        : 'Nomor bulan tidak valid';
}

function konversiTanggal(serialNumber) {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const tanggalAwalExcel = new Date(1899, 11, 30); // Tanggal awal dalam format Excel

    const daysSinceAwalExcel = serialNumber - 1; // Penyesuaian karena tanggal awal dihitung sebagai 1
    const millisecondsSinceAwalExcel = daysSinceAwalExcel * millisecondsPerDay;

    const tanggalAkhir = new Date(
        tanggalAwalExcel.getTime() + millisecondsSinceAwalExcel
    );
    return tanggalAkhir.toDateString(); // Mengubah menjadi string tanggal yang lebih umum
}

function getFormattedDate() {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const today = new Date();

    // Ambil informasi tanggal, bulan, dan tahun dari objek Date
    const day = String(today.getDate()).padStart(2, '0'); // Tambahkan '0' di depan jika hanya satu digit
    const monthIndex = today.getMonth();
    const month = months[monthIndex];
    const year = today.getFullYear();

    // Gabungkan dalam format yang diinginkan (dd/month/yyyy)
    const formattedDate = `${day} ${month} ${year}`;

    return formattedDate;
}

module.exports = {
    readMonth,
    sortByMonth,
    readName,
    sortByName,
    getMonthName,
    konversiTanggal,
    getFormattedDate,
};
