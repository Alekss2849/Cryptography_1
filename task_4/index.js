//Here for more
//https://www.youtube.com/watch?v=-fKswAHcUdQ
const fs = require('fs');

shuffle = arr =>{
    return arr.sort((a, b) => 0.5 - Math.random());
}

//https://norvig.com/ngrams/
process3Grams = () =>{
    const text = fs.readFileSync('./3grams.txt', 'utf8');
    const array = text.split(/\r\n|\n/g).map(item => {
        const split = item.split(/\s+/);
        return [split[0], parseInt(split[1])];
    });
    const sum = array.reduce((a, b) => a + b[1], 0);
    return new Map(array.map(a => [a[0], a[1] / sum]));
}

const alphabetLowercase = [...Array(26).keys()].map(i => String.fromCharCode(i + 'a'.charCodeAt(0)));
const grams3 = process3Grams();
//Checked on English text
const ENGLISH_THRESHOLD = 0.00097;

getRandomAlphabetKey = () => {
    const alphabet = alphabetLowercase;
    const shuffled = shuffle([...alphabet]);
    // return new Map(alphabet.map((item, i) => [item, shuffled[i]]));
    return shuffled;
}

crossover = (key1, key2, crossoverPoint) => {
    if(!crossoverPoint){
        crossoverPoint = Math.floor(Math.random() * key1.length)
    }
    const key1End = key1.slice(crossoverPoint);
    const key2End = key2.slice(crossoverPoint);
    const key1EndPositions = [...Array(key1End.length).keys()].sort((a, b) => key1End[a].charCodeAt(0) - key1End[b].charCodeAt(0));
    const key2EndPositions = [...Array(key2End.length).keys()].sort((a, b) => key2End[a].charCodeAt(0) - key2End[b].charCodeAt(0));

    return[key1.slice(0, crossoverPoint).concat(key2EndPositions.map(index => key1End[index])),
           key2.slice(0, crossoverPoint).concat(key1EndPositions.map(index => key2End[index]))];
}

mutateKey = key => {
    const index1 = Math.floor(Math.random() * key.length);
    const index2 = Math.floor(Math.random() * key.length);
    [key[index1], key[index2]] = [key[index2], key[index1]];
    return key;
}

getStartPopulation = size =>{
    let res = [];
    while(res.length < size){
        const key = getRandomAlphabetKey();
        if(!res.includes(key))
            res.push(key);
    }
    return res;
}

similarToEnglishPercent = text =>{
    let res = 0;
    for(let i = 0; i < text.length - 2; ++i){
        const text3Gramm = text.substring(i, i+3);
        res += grams3.get(text3Gramm) ?? 0;
    }
    return res / (text.length-2);
}

substitutionDecrypt = (keyAlphabet, text) => Array.from(text).map(l => keyAlphabet[l.charCodeAt(0) - 'a'.charCodeAt(0)]).join('');

getPopulationParent = (population, numberOfParent, text) => {
    // console.log('++++++++++++++++++++++++++++++++++++');
    const res = population.sort((a, b) => similarToEnglishPercent(substitutionDecrypt(b, text)) - similarToEnglishPercent(substitutionDecrypt(a, text))).slice(0, numberOfParent)
    // console.log(res.map(a => similarToEnglishPercent(substitutionDecrypt(a, text))));
    // console.log('++++++++++++++++++++++++++++++++++++');
    return res;
};

decrypt = startText =>{
    const PARENTS_SELECTION_NUMBER = 250;
    let population = getStartPopulation(500);
    let res;
    
    let counter = 0;
    while(!res || similarToEnglishPercent(res) < ENGLISH_THRESHOLD){
        let newPopulation = []; 
        population = getPopulationParent(population, PARENTS_SELECTION_NUMBER, startText);
        for(let i = 0; i < PARENTS_SELECTION_NUMBER; i+=2){
            newPopulation = newPopulation.concat(crossover(population[i], population[i+1]));
        }
        newPopulation = newPopulation.map(mutateKey);
        population = population.concat(newPopulation);
        res = substitutionDecrypt(getPopulationParent(population, PARENTS_SELECTION_NUMBER, startText)[0], startText);

        if (++counter % 100 === 0) {
            console.log("\nPopulation: ", counter);
            console.log(similarToEnglishPercent(res));
            console.log(res);
        }
    }
    return res;
}

main = () => {
    const startText = fs.readFileSync('input.txt', 'utf8').toLowerCase();
    const decrypted = decrypt(startText);
    console.log("Finished");
    console.log(decrypted);
    fs.writeFileSync('./output.txt', decrypted, {encoding: "utf8"});
}

if(require.main === module){
    main();
}