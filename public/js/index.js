//query element
var tdElements = document.querySelectorAll(".accumulator td");
const countButton = document.getElementById("hitungGaji");
const fieldGaji = document.getElementById("fieldCountGaji");
const fieldHitung = document.getElementById("perhitungan");
const kinerjaField = document.getElementById("kinerjaField");
const kinButton = document.getElementById("kinerja");

//rate
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

//kalkulasi gaji
var gaji =
  parseFloat(jumlahMasuk) * harian +
  parseFloat(jamKerja) * perjam +
  parseFloat(jumlahSiswa) * perSiswa +
  parseFloat(halamanKunci) * hlmnKetik +
  parseFloat(halamanKetik) * hlmnKunci +
  parseFloat(quiziz) * hlmnQuiziz;
var kinerja = 0;

// Perjamnya  ada di bm di rentang 5000- 7000
// Membantu anak belajar di rentang 10.000- 15.000 peranak
// Transport di rentang 10.000-12500 perhari kerja

function updateCount(addKinerja = 0) {
  const count = `
    <p>${jumlahMasuk} x 12500 = Rp.${parseFloat(jumlahMasuk) * harian}</p>
    <p>${jamKerja} x 5000 = Rp.${parseFloat(jamKerja) * perjam}</p>
    <p>${jumlahSiswa} x 7000 = Rp.${parseFloat(jumlahSiswa) * perSiswa}</p>
    <p>${halamanKunci} x 7000 = Rp.${parseFloat(halamanKunci) * hlmnKunci}</p>
    <p>${halamanKetik} x 5000 = Rp.${parseFloat(halamanKetik) * hlmnKetik}</p>
    <p>${quiziz}  x 7000 = Rp.${parseFloat(quiziz) * hlmnQuiziz}</p>
    <p>Rp.${addKinerja}</p>

    <b>Total : Rp.${gaji + addKinerja}</b>
  `;

  fieldHitung.innerHTML = count;
}

//fungsi untuk menampilkan tampilan awal, serta menambahkan kinerja
kinButton.addEventListener("click", function () {
  const val = document.getElementById("kinerjaInput").value;
  updateCount(parseFloat(val)); // Memanggil fungsi updateCount untuk memperbarui tampilan
  console.log(gaji);
});

// Memanggil updateCount untuk menginisialisasi tampilan awal
updateCount();
