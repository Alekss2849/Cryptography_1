const utf8 = require('utf8');
const fs = require('fs');

const ENGLISH_FREQUENCIES = [
    0.08167, 0.01492, 0.02782, 0.04253,
    0.12702, 0.02228, 0.02015, 0.06094,
    0.06966, 0.00153, 0.00772, 0.04025,
    0.02406, 0.06749, 0.07507, 0.01929,
    0.00095, 0.05987, 0.06327, 0.09056,
    0.02758, 0.00978, 0.02360, 0.00150,
    0.01974, 0.0007,];

//Count how much the text is similar to English
const countDifferenceToEnglish = text =>{
    // console.log(text);
    const notLetters = /[\n,.\-_()'"”“]/g;
    const lettersFiltered = text.replace(notLetters, '').toLowerCase();
    //Count how many times letters are in text. 0 index stands for 'a'
    const letters = [...Array(26).keys()].map(item => String.fromCharCode(item + 'a'.charCodeAt(0)));
    const lettersFrequency = letters.map(l => {
        const n = text.match(new RegExp(l, 'g'));
        return n ? n.length : 0;
    });
    const result = lettersFrequency.reduce((res, curr, index) => {
        letterPercent = curr / lettersFiltered.length;
        return res += Math.abs(letterPercent - ENGLISH_FREQUENCIES[index]);
    }, 0);
    return result;
}

//Find minimum difference
//texts - byte array
const decodeOneByteXOR = bytes =>{
    //Get all xor combinations for 1 byte
    const xored = [...Array(256).keys()].map(i => Buffer.from(bytes.map(j => i ^ j)).toString());
    return xored.reduce((prev, curr) => countDifferenceToEnglish(prev) < countDifferenceToEnglish(curr) ? prev : curr);
}

task2 = () => {
    const input = fs.readFileSync('./XORInput.txt', 'utf8');
    //Parse input hex
    const bytes = input.match(/.{1,2}/g).map(elem => parseInt(elem, 16));
    const result = decodeOneByteXOR(bytes);
    console.log(result);
    fs.writeFileSync('./output.txt', result);
}

main = () => {
    task2();
}

if(require.main === module){
    main();
}

module.exports = {
    countDifferenceToEnglish,
    decodeOneByteXOR
};