const { excelReadFile, detailAsisten } = require('./readfile');

const fs = require('fs');

const dirPath = './modal';
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}
// membuat file jika belum exist
const filePath = './modal/rate.json';

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
}

const loadRate = () => {
    const fileRate = fs.readFileSync(filePath, 'utf8');
    const rate = JSON.parse(fileRate);
    return rate;
};

const editRate = (data) => {
    const newRate = data;
    const newArray = [];
    newArray.push(newRate);
    fs.writeFile('./modal/rate.json', JSON.stringify(newArray), (e) => {
        console.log(e);
    });
};

const hitungRate = (dataAsisten) => {
    //load data yang diperlukan
    const rates = loadRate();
    const rate = rates[0];
    const asistData = dataAsisten[0];
    //load data yang diperlukan

    // rubah json menjadi string
    for (let prop in rate) {
        rate[prop] = parseInt(rate[prop]);
    }

    const gaji = {
        transport: rate.transport * asistData.jumlah_masuk,
        perJam: rate.perJam * asistData.jam_kerja,
        perSiswa: rate.perSiswa * asistData.siswa,
        hlmnKetik: rate.hlmnKetik * asistData.halaman_ketik,
        hlmnKunci: rate.hlmnKunci * asistData.halaman_kunci,
        hlmnQuiziz: rate.hlmnQuiziz * asistData.quiziz,
    };

    gaji.total =
        gaji.transport +
        gaji.perJam +
        gaji.perSiswa +
        gaji.hlmnKetik +
        gaji.hlmnKunci +
        gaji.hlmnQuiziz;

    const hasil = [asistData, rate, gaji];
    return gaji;
};

module.exports = {
    loadRate,
    editRate,
    hitungRate,
};
