const fs = require('fs');
const { countDifferenceToEnglish, decodeOneByteXOR } = require('../task_2');

//https://stackoverflow.com/questions/22015684/how-do-i-zip-two-arrays-in-javascript
const zip = (...arr) => Array(Math.max(...arr.map(a => a.length))).fill().map((_, i) => arr.map(a => a[i]));

//Divide text into sections for every char of key
getSections = (keyLength, text) => {
    let sections = [];
    for(let i = 0; i < keyLength; ++i){
        const section = [];
        for(let j = i; j < text.length; j+=keyLength){
            section.push(text[j]);
        }
        sections.push(section);
    }
    return sections;
}

collectSections = sections =>{
    const zipped = zip(...sections.map(section => Array.from(section))).flat(1);
    return zipped.join("");
}

main = () => {
    const base64 = fs.readFileSync('./input.txt', 'utf8');
    const plainText = Buffer.from(base64, 'base64').toString('ascii');
    fs.writeFileSync('./output.txt', plainText, {encoding: "utf8"});

    const shiftedTexts = Array(plainText.length - 1).fill(1).map((x, y) => x + y).map( elem => plainText.substring(plainText.length - elem) + plainText.substring(0, plainText.length - elem) );
    const coincidence = shiftedTexts.map(text => {
        let common = 0;
        for(let i = 0; i < text.length; ++i){
            if(text[i] === plainText[i]){
                ++common;
            }
        }
        return common;
    });
    /*
        Key length = 3;
        Value of "coincidence":
        0, 0, 33, 2, 4, 27, 1, 0, 44, 2, 1, 35,
        3, 1, 39, 1, 1, 35, 0, 1, 32, 4, 0, 36,
        1, 4, 31, 2, 1, 25, 0, 3, 32, 0, 2, 26,
        1, 4, 29, 1, 2, 39, 1, 1, 29, 0, 4, 35,
        3, 1, 28, 0, 4, 25, 3, 2, 32, 1, 4, 21,
        1, 2, 21, 1, 4, 33, 2, 3, 31, 1, 1, 25,
        1, 3, 34, 2, 1, 29, 0, 9, 21, 2, 2, 24,
        2, 1, 28, 0, 3, 26, 0, 3, 30, 1, 7, 34,
        1, 5, 32, 2,
    */
    const KEY_LENGTH = 3;

    //Decipher every section
    const sectionsDeciphered = getSections(KEY_LENGTH, plainText).map(item => {
        return decodeOneByteXOR(item.map(i => i.charCodeAt(0)));
    });

    const result = collectSections(sectionsDeciphered);
    console.log(result);
    fs.writeFileSync('./output.txt', result);
}

if(require.main === module){
    main();
}

// console.log(result);
// console.log(plainText);