const gm = require('gm');

gm(125, 30, "#accadb ")
  .font("Frygia.ttf", 18)
  .drawText(5, 20, "AAABU9876X", 100)
  .write("number.jpg", function (err) {
    console.log(err);
  });