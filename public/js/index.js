const total = document.getElementById("totalGaji");
const nilaiTotal = parseInt(total.innerText);

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

document.getElementById("kinerja").addEventListener("click", function (event) {
  const input = parseInt(document.getElementById("kinerjaInput").value);
  console.log(input);
  if (isNaN(input)) {
    alert("input Kinerja");
  } else {
    // const nilaiTotal = parseInt(total.innerText);
    const penambahan = input + nilaiTotal;
    total.innerText = penambahan;
    alert(`tambahakn kinerja sebanyak Rp.${formatCurrency(input)}`);
  }
});
