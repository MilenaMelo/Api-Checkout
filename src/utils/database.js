// ------------------- import --------------------------- //
const fs = require('fs');

// use promises
const fsp = fs.promises;

// use path and data
const FILE = 'src/database/data.json';
const PATH_DATABASE = 'database';

// ------------------- read file

const fileReader = async () => {
    // check file
    try {
        if (fs.existsSync(FILE)) {
            const file = await fsp.readFile(FILE, (err, data) => {
                if (err) {
                    return err;
                }
                return data;
            });

            if (file.length > 0) {
                return JSON.parse(file)
            }
        }
        return [];
    } catch (err) {
        return false
    }
};

const fileWriter = async (data) => {
    try {
        if (!fs.existsSync(PATH_DATABASE)) {
            fs.mkdirSync(PATH_DATABASE);
        }
        await fsp.writeFile(FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        return false;
    }
};


// ------------------- export functions --------------------- //
module.exports = { fileReader, fileWriter }
