const total = document.getElementById('totalGaji');
const nilaiTotal = parseInt(total.innerText);

function formatCurrency(number) {
    // Mengubah angka menjadi string
    let numStr = number.toString();
    // Membagi angka menjadi bagian sebelum dan sesudah desimal (jika ada)
    let parts = numStr.split('.');
    let integerPart = parts[0];
    let decimalPart = parts.length > 1 ? '.' + parts[1] : '';
    // Menambahkan titik setiap 3 digit pada bagian integer
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    // Menggabungkan kembali bagian integer dan desimal
    return integerPart + decimalPart;
}

function formatAngka(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function konversiAngka(stringAngka) {
    const angkaTanpaTitik = parseInt(stringAngka.replace(/\./g, ''));
    return angkaTanpaTitik;
}

const tambahKinerja = document.getElementById('addKinerja');
const totalGaji = document.getElementById('totalGaji');
const btnAdd = document.getElementById('buttonKinerja');
let jumlahTotal = konversiAngka(totalGaji.value);

btnAdd.addEventListener('click', () => {
    console.log(parseInt(tambahKinerja.value));
    console.log(jumlahTotal);
    let kinerja = parseInt(tambahKinerja.value);
    let sum = jumlahTotal + kinerja;
    totalGaji.value = formatAngka(sum);

    // document.getElementById(totalGaji).innerText = kinerja + totalGaji;
});
