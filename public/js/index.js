//query element
var tdElements = document.querySelectorAll(".accumulator td");
const countButton = document.getElementById("hitungGaji");
const fieldGaji = document.getElementById("fieldCountGaji");
const fieldHitung = document.getElementById("perhitungan");
const kinerjaField = document.getElementById("kinerjaField");
const kinButton = document.getElementById("kinerja");

//rate BM
const harian = 12500;
const perjam = 5000;
const perSiswa = 7000;
const hlmnKetik = 5000;
const hlmnKunci = 7000;
const hlmnQuiziz = 7000;

//ambil nilai tabel
var jumlahMasuk = tdElements[0].textContent;
var jamKerja = tdElements[1].textContent;
var jumlahSiswa = tdElements[2].textContent;
var halamanKunci = tdElements[3].textContent;
var halamanKetik = tdElements[4].textContent;
var quiziz = tdElements[5].textContent;
var lainLain = tdElements[6].textContent;

//hitung gaji
const gajiJumlahMasuk = parseFloat(jumlahMasuk) * harian;
const gajiJamKerja = parseFloat(jamKerja) * perjam;
const gajiPersiswa = parseFloat(jumlahSiswa) * perSiswa;
const gajiKunci = parseFloat(halamanKunci) * hlmnKunci;
const gajiKetik = parseFloat(halamanKetik) * hlmnKetik;
const gajiQuiziz = parseFloat(quiziz) * hlmnQuiziz;

//kalkulasi gaji
var gaji =
  gajiJumlahMasuk +
  gajiJamKerja +
  gajiPersiswa +
  gajiKunci +
  gajiKetik +
  gajiQuiziz;
var kinerja = 0;

// Perjamnya  ada di bm di rentang 5000- 7000
// Membantu anak belajar di rentang 10.000- 15.000 peranak
// Transport di rentang 10.000-12500 perhari kerja

function updateCount(addKinerja = 0) {
  const count = `
    <p>${jumlahMasuk} x 12500 = Rp.${formatCurrency(gajiJumlahMasuk)}</p>
    <p>${jamKerja} x 5000 = Rp.${formatCurrency(gajiJamKerja)}</p>
    <p>${jumlahSiswa} x 7000 = Rp.${formatCurrency(gajiPersiswa)}</p>
    <p>${halamanKunci} x 7000 = Rp.${formatCurrency(gajiKunci)}</p>
    <p>${halamanKetik} x 5000 = Rp.${formatCurrency(gajiKetik)}</p>
    <p>${quiziz}  x 7000 = Rp.${formatCurrency(gajiQuiziz)}</p>
    <p>Rp.${formatCurrency(addKinerja)}</p>
    <p> ------------------ + </p>

    <b>Total : Rp.${formatCurrency(gaji + addKinerja)}</b>
  `;

  fieldHitung.innerHTML = count;
}

//fungsi untuk menampilkan tampilan awal, serta menambahkan kinerja
kinButton.addEventListener("click", function () {
  const val = document.getElementById("kinerjaInput").value;
  updateCount(parseFloat(val)); // Memanggil fungsi updateCount untuk memperbarui tampilan
  // console.log(gaji);
});

// Memanggil updateCount untuk menginisialisasi tampilan awal
updateCount();

function formatCurrency(number) {
  // Mengubah angka menjadi string
  let numStr = number.toString();

  // Membagi angka menjadi bagian sebelum dan sesudah desimal (jika ada)
  let parts = numStr.split(".");
  let integerPart = parts[0];
  let decimalPart = parts.length > 1 ? "." + parts[1] : "";

  // Menambahkan titik setiap 3 digit pada bagian integer
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Menggabungkan kembali bagian integer dan desimal
  return integerPart + decimalPart;
}
