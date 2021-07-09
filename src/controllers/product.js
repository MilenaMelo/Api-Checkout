// ------------------- import data --------------------------- //
const { fileReader } = require("../utils/database");


// ------------------- GET functions

// return products
async function getProducts(req, res) {
    const file = await fileReader();
    console.log(file);

}


// ------------------- export functions --------------------- //
module.exports = { getProducts }