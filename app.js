const express = require('express');
const XLSX = require('xlsx');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3000;
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
} = require('./utility/sorting');
const { log } = require('console');

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
    // Kirim respons ke klien
    res.redirect('/');
});

app.get('/upload', (req, res) => {
    res.render('upload');
});

app.get('/', (req, res) => {
    res.redirect('/menu');
});

// app.get('/mentah', (req, res) => {
//     const dataPengajar = loadDataPengajar();
//     const summary = excelReadFile(dataPengajar);

//     res.send(summary);
// });

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

// detail absensi per orangan
app.get('/menu/:bulan/:nama', (req, res) => {
    // ambil parameter get
    const bulan = req.params.bulan;
    const nama = req.params.nama;

    // * Detail Perhari
    const dataPengajar = loadDataPengajar(); // query seluruh data
    const dataSortedByMonth = sortByMonth(dataPengajar, bulan); // filter berdasarkan bulan
    const dataSortedByName = sortByName(dataSortedByMonth, nama); // filter berdasarkan nama
    const tempSummary = dayDetail(dataSortedByName);
    // * Detail Perhari

    // * Summary
    const person = [];
    const MonthlySummary = excelReadFile(dataSortedByMonth);
    MonthlySummary.forEach((dataIndividu) => {
        if (dataIndividu.nama.toLowerCase() == nama.toLowerCase()) {
            person.push(dataIndividu);
        }
    });

    // * Summary

    //
    res.send({ detail: tempSummary, ringkasan: person });
});

// ! api untuk mendisplay ringkasan semua data secara keseluruhan tanpa filter
app.get('/payroll/:bulan/:nama', (req, res) => {
    const bulan = req.params.bulan;
    const nama = req.params.nama;

    const dataPengajar = loadDataPengajar(); // load semua data
    const dataSortedByMonth = sortByMonth(dataPengajar, bulan);
    const person = [];
    const MonthlySummary = excelReadFile(dataSortedByMonth);
    MonthlySummary.forEach((dataIndividu) => {
        if (dataIndividu.nama.toLowerCase() == nama.toLowerCase()) {
            person.push(dataIndividu);
        }
    });
    res.send(person);
});

// ! api yang mengarahkan ke konfigurasi gaji sehingga bisa di ganti
app.get('/rateGaji', (req, res) => {
    const rate = loadRate();
    // res.render('rateGaji', { rate });
    res.send({ rate });
});

// ! api untuk save pengubahan gaji
app.post('/rateGaji', (req, res) => {
    editRate(req.body);
    res.redirect('/');
});

// ! api untuk mengolah upload data

app.listen(port, () => {
    console.log(`example app listening to port http://localhost:${port}/`);
});
