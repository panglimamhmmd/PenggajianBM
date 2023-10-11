const express = require("express");
const app = express();
const port = 3000;
// var wkhtmltopdf = require("wkhtmltopdf");
const { excelReadFile, detailAsisten } = require("./utility/readfile");
const { loadRate, editRate, hitungRate } = require("./utility/rateManage");

// view engine
app.set("view engine", "ejs");

// *app.post agar terbaca
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// *app.post agar terbaca

app.use(express.static(__dirname + "/public"));

// api untuk mendisplay semua data secara keseluruhan tanpa filter
app.get("/", (req, res) => {
  const persons = excelReadFile();

  res.render("main", { persons });
});

// mendapatkan data assiten
app.get("/detailAsisten/:nama", (req, res) => {
  const nama = detailAsisten(req.params.nama);
  const head = req.params.nama;
  const data = hitungRate(req.params.nama);
  res.render("detailAsisten", { nama: [nama], head, data });
});

// api yang mengarahkan ke konfigurasi gaji sehingga bisa di ganti
app.get("/rateGaji", (req, res) => {
  const rate = loadRate();
  res.render("rateGaji", { rate });
});

// api untuk save pengubahan gaji
app.post("/rateGaji", (req, res) => {
  editRate(req.body);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`example app listening to port http://localhost:${port}/`);
});
