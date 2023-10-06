const fs = require("fs");

const dirPath = "./modal";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}
// membuat file jika belum exist
const filePath = "./modal/rate.json";
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]");
}

const loadRate = () => {
  const fileRate = fs.readFileSync(filePath, "utf8");
  const rate = JSON.parse(fileRate);
  return rate;
};

const editRate = (data) => {
  const newRate = data;
  const newArray = [];
  newArray.push(newRate);
  fs.writeFile("./modal/rate.json", JSON.stringify(newArray), (e) => {
    console.log(e);
  });
};

module.exports = {
  loadRate,
  editRate,
};
