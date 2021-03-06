'use strict';
const yargs = require("yargs");
const fs = require("fs");
const func = require("./functions.js");

function main() {
    const args = yargs
        .usage("Searching characters")
        .alias({'i' : 'id',
                'n': 'name',
                's': 'status',
                'r': 'species',
                't': 'type',
                'g': 'gender',
                'o' : 'origin',
                'l' : 'location'})
        .argv;

    func.search(args).then((data, err) => {
        if (err) console.log(err);
        const result = func.filterResultData(data);
        if (result.length > 0) {
            const resultToConsole = func.makeResultReadable(result);
            console.log(resultToConsole);
            fs.writeFileSync(`${Date.now()}.json`, JSON.stringify(result, null, 2));
        }
        else console.log(`No matches found.`);
    })
}

main();
