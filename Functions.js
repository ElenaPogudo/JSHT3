'use strict';
const request = require('request-promise-native');
const firstUrl = "https://rickandmortyapi.com/api/character";


function dataReceiver() {
    let result = [];
    const getChars = (firstUrl) => request(firstUrl, {json: true}).then((body) => {
            result = result.concat(body.results);
            if (body.info.next !== "") {
                return getChars(body.info.next);
            } else return result;
        });

    return getChars(firstUrl);
}

function search(args) {
    return new Promise((resolve, reject) => {
        const properties = getProperties(args);               
        try {
            dataReceiver().then((data) => {        
                const chars = data.map((el) => {
                    let flag = true;                       //flag to indicate that current character fits the criteria
                    for (let i = 0; i < properties.length; i++) {                         //checking multiple parameters
                        if (properties[i] === 'origin' || properties[i] === 'location') {       //"origin" and "location" parameters are objects
                            if (el[properties[i]].name.indexOf(args[properties[i]]) === -1) {   //and have to be checked by their .name property
                                flag = false;              //if one parameter does not fit the criteria, character is marked as not right
                                break;                     //and cycle breaks
                            }
                        } else {
                            if (el[properties[i]].indexOf(args[properties[i]]) === -1) {
                                flag = false;
                                break;
                            }
                        }
                    }
                    if (flag === true) {
                        return el;
                    }       //if the character is marked as right, return it to the result array
                })
                resolve(chars);
            })
        } catch (err) {
            reject(err);
        }
    })
}

function getProperties(args) {
    const result = [];
    const properties = ['id', 'name', 'species', 'status', 'type', 'gender', 'origin', 'location', 'episode'];

    Object.keys(args).forEach((el) => {
        if (properties.includes(el)) result.push(el);
    });

    return result;
}

function filterResultData(arr) {
    return arr.filter((el) => el !== undefined)
}

function makeResultReadable(data) {         //make result look good
    let result = `${data.length} matches found:`;
    data.forEach((el) => {
        result += `\n\nId: ${el.id};\nName: ${el.name};\nStatus: ${el.status};\nSpecies: ${el.species};\nType: ${el.type};\nGender: ${el.gender};\nOrigin: ${el.origin.name};\nLocation: ${el.location.name}`
    })
    return result;
}


exports.filterResultData = filterResultData;
exports.makeResultReadable = makeResultReadable;
exports.search = search;
