const express = require("express");
const app = express();
const port = 3000;
const { excelReadFile, detailAsisten } = require("./utility/readfile");

// view engine
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  const persons = excelReadFile();
  // console.log(persons["adit"]);
  res.render("main", { persons });
});

app.get("/detailAsisten/:nama", (req, res) => {
  const nama = detailAsisten(req.params.nama);
  const head = req.params.nama;
  // console.log([nama]);
  res.render("detailAsisten", { nama: [nama], head: head });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
