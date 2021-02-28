const fs = require("fs");

console.log("A");
const result = fs.readFileSync("syntax/sample.txt", "utf-8");
console.log(result);
console.log("C");

console.log("A");
fs.readFile("syntax/sample.txt", "utf-8", (err, data) => {
  console.log(data);
});
console.log("C");
