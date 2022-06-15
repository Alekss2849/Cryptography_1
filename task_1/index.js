const fs = require('fs');

const binaryText = fs.readFileSync('./binary.txt', 'utf8');
const base64 = binaryText.match(/.{1,8}/g).map(elem => String.fromCharCode(parseInt(elem, 2))).join("");
const plainText = Buffer.from(base64, 'base64').toString('ascii');
fs.writeFileSync('./output.txt', plainText, {encoding: "utf8"});
console.log(plainText);