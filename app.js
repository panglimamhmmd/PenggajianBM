const express = require('express');
const XLSX = require('xlsx');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3000;
const path = require('path');

// var wkhtmltopdf = require("wkhtmltopdf");
const {
    excelReadFile,
    detailAsisten,
    uploadRecieve,
    loadDataPengajar,
    dayDetail,
} = require('./utility/readfile');

const { loadRate, editRate, hitungRate } = require('./utility/rateManage');
const {
    readMonth,
    sortByMonth,
    readName,
    sortByName,
    getMonthName,
    konversiTanggal,
    getFormattedDate,
} = require('./utility/sorting');

const { cretaSalarySlip } = require('./utility/createPDF');
const createSalarySlip = require('./utility/createPDF');

// view engine
app.set('view engine', 'ejs');

// multer middleware
const upload = multer({ dest: 'uploads/' });

// *app.post agar terbaca
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// *asset untuk file public
app.use(express.static(__dirname + '/public'));

// handle upload file
app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = req.file.path; // menggunakan multer, mengambil data excel
    const dataJson = uploadRecieve(filePath); // rubah file menjadi format json
    fs.writeFile('./modal/datas.json', JSON.stringify(dataJson), (e) => {
        console.log(e);
    }); // tulis data ke modal/datas.json (database buatan)
    // Hapus file setelah selesai menggunakannya (opsional)
    fs.unlinkSync(filePath);

    console.log('berhasil Simpan');
    // Kirim respons ke klien
    res.redirect('/absensi');
});

//menu upload
app.get('/upload', (req, res) => {
    res.render('uploadPage', { subMenu: 'upload' });
});

app.get('/upload123', (req, res) => {
    res.render('upload');
});

// redirect
app.get('/', (req, res) => {
    res.redirect('/upload');
});

// Menu List Bulan
app.get('/absensi', (req, res) => {
    const dataPengajar = loadDataPengajar();
    const bulan = readMonth(dataPengajar); // ambil bulan apa saja yang ada

    res.render('MonthList', {
        subMenu: 'absensi',
        monthList: bulan,
    });
});

// Menu List Nama dan Summary
app.get('/absensi/:bulan', (req, res) => {
    const bulan = req.params.bulan;
    const namaBulan = getMonthName(parseInt(bulan));
    const dataPengajar = loadDataPengajar(); // load semua data
    const dataSortedByMonth = sortByMonth(dataPengajar, bulan); // sort by month
    const MonthlySummary = excelReadFile(dataSortedByMonth);
    res.render('absensi', {
        subMenu: 'absensi',
        monthly: MonthlySummary,
        bulan,
        namaBulan,
    });
});

// Menu List Detail Pengajar
app.get('/absensi/:bulan/:nama', (req, res) => {
    const bulan = req.params.bulan;
    const nama = req.params.nama;
    const namaBulan = getMonthName(parseInt(bulan));
    // * Detail Perhari
    const dataPengajar = loadDataPengajar(); // query seluruh data
    const dataSortedByMonth = sortByMonth(dataPengajar, bulan); // filter berdasarkan bulan
    const dataSortedByName = sortByName(dataSortedByMonth, nama); // filter berdasarkan nama
    const tempSummary = dayDetail(dataSortedByName);

    tempSummary.forEach((el) => {
        el.tanggal = konversiTanggal(el.tanggal);
    });

    res.render('MonthlyList', {
        subMenu: 'absensi',
        nama,
        bulan,
        namaBulan,
        summary: tempSummary,
    });
});

// Atur Rate
app.get('/rate', (req, res) => {
    const rate = loadRate();
    // res.send(rate);
    res.render('PayrollConfig', { rate: rate, subMenu: 'rate' });
});

function formatAngka(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Hitung Gaji
app.get('/payroll/:bulan/:nama', (req, res) => {
    const nama = req.params.nama;
    const bulan = req.params.bulan;
    const namaBulan = getMonthName(parseInt(bulan));
    const rate = loadRate();
    const person = [];
    const dataPengajar = loadDataPengajar(); // query seluruh data
    const dataSortedByMonth = sortByMonth(dataPengajar, bulan); // filter berdasarkan bulan
    const MonthlySummary = excelReadFile(dataSortedByMonth);
    MonthlySummary.forEach((dataIndividu) => {
        if (dataIndividu.nama.toLowerCase() == nama.toLowerCase()) {
            person.push(dataIndividu);
        }
    });
    const gaji = hitungRate(person);

    // res.send(rate);
    // res.render('detailAsisten', { head: 'hitungaji', subMenu: 'detail' });
    res.render('Absensi-Slipgaji', {
        subMenu: 'absensi',
        rate,
        person,
        nama,
        bulan,
        namaBulan,
        gaji,
        formatAngka,
    });
});

// ! dummy

// tampilan awal, pilihan bulan yang akan dipilih
app.get('/menu', (req, res) => {
    const dataPengajar = loadDataPengajar();
    const bulan = readMonth(dataPengajar); // ambil bulan apa saja yang ada
    res.send(bulan);
});
// list nama yang ada dalam bulan tertentu
app.get('/menu/:bulan', (req, res) => {
    const bulan = req.params.bulan;
    const dataPengajar = loadDataPengajar(); // load semua data
    const dataSortedByMonth = sortByMonth(dataPengajar, bulan); // sort by month
    const MonthlySummary = excelReadFile(dataSortedByMonth);
    // const uniqueName = readName(dataSorted); // ammil unique name
    res.send({ DataSebulan: MonthlySummary });
});

function formatAngka(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// detail absensi per orangan
app.get('/menu/:bulan/:nama', (req, res) => {
    const nama = req.params.nama;
    const bulan = req.params.bulan;
    const namaBulan = getMonthName(parseInt(bulan));
    const rate = loadRate();
    const person = [];
    const dataPengajar = loadDataPengajar(); // query seluruh data
    const dataSortedByMonth = sortByMonth(dataPengajar, bulan); // filter berdasarkan bulan
    const MonthlySummary = excelReadFile(dataSortedByMonth);
    MonthlySummary.forEach((dataIndividu) => {
        if (dataIndividu.nama.toLowerCase() == nama.toLowerCase()) {
            person.push(dataIndividu);
        }
    });
    const gaji = hitungRate(person);

    // res.send(rate);
    // res.render('detailAsisten', { head: 'hitungaji', subMenu: 'detail' });
    res.send({
        subMenu: 'absensi',
        rate,
        person,
        nama,
        bulan,
        namaBulan,
        gaji,
        format,
    });
});

app.post('/');

// ! api untuk mendisplay ringkasan semua data secara keseluruhan tanpa filter
app.get('/dataSummary/:bulan/:nama', (req, res) => {
    const bulan = req.params.bulan;
    const nama = req.params.nama;

    const dataPengajar = loadDataPengajar(); // load semua data
    const dataSortedByMonth = sortByMonth(dataPengajar, bulan);

    const person = [];
    const MonthlySummary = excelReadFile(dataPengajar);
    MonthlySummary.forEach((dataIndividu) => {
        if (dataIndividu.nama.toLowerCase() == nama.toLowerCase()) {
            person.push(dataIndividu);
        }
    });
    res.send(MonthlySummary);
});

// ! api untuk save pengubahan gaji
app.post('/rateGaji', (req, res) => {
    editRate(req.body);
    res.redirect('/upload');
});

app.post('/cetakSlip/:bulan/:nama', (req, res) => {
    const nama = req.params.nama;
    const bulan = req.params.bulan;
    const namaBulan = getMonthName(parseInt(bulan));
    const rate = loadRate();
    const person = [];
    const dataPengajar = loadDataPengajar(); // query seluruh data
    const dataSortedByMonth = sortByMonth(dataPengajar, bulan); // filter berdasarkan bulan
    const MonthlySummary = excelReadFile(dataSortedByMonth);
    MonthlySummary.forEach((dataIndividu) => {
        if (dataIndividu.nama.toLowerCase() == nama.toLowerCase()) {
            person.push(dataIndividu);
        }
    });

    // ambil body request

    const gaji = hitungRate(person);
    const body = req.body;
    // ambil total gaji
    const total = parseInt(gaji.total + parseInt(body.kinerja));
    // jam kerja
    let currentDate = getFormattedDate();
    const kinerja =
        gaji.total - gaji.perJam - gaji.transport + parseInt(body.kinerja);

    const dataSummary1 = {
        transport: gaji.transport,
        kinerja,
        total,
        jamKerja: gaji.perJam,
        jamKerjaTotal: person[0].jam_kerja,
        transportTotal: person[0].jumlah_masuk,
    };
    const dataSummary2 = {
        bulan: namaBulan,
        tahun: 2023,
        nama,
        tanggal: currentDate,
    };

    const stream = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment;filename=${dataSummary2.tahun}_${dataSummary2.bulan}_${dataSummary2.nama}.pdf`,
    });

    createSalarySlip(
        dataSummary1,
        dataSummary2,
        (chunk) => stream.write(chunk), // Write the chunk directly to the stream
        () => stream.end() // End the stream after all data has been written
    );
});

app.listen(port, () => {
    console.log(`example app listening to port http://localhost:${port}/`);
});
