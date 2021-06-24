const fs = require('fs');

const fsp = fs.promises;

const FILE = 'banco/data.json';
const PATH_DATABASE = 'banco';

const readFile = async () => {
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

const writeFile = async (data) => {
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

module.exports = {
    readFile: readFile,
    writeFile: writeFile
}