// ------------------- import data --------------------------- //
const fs = require("fs");

// use promises
const fsp = fs.promises;

// use path
const path = 'src/database/data.json';

// ------------------- functions

async function readFile() {
    // check file
    try {
        const file = await fsp.readFile(path, (err, data) => {
            if(err) {
                return err;
            }
            return data;
        });

    }catch (err) {
        return false;
    }
    // return file content
    if(path.length > 0) {
        return JSON.parse(file);
    }
}

// ------------------- export functions --------------------- //
module.exports = { readFile }