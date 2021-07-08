// ------------------- import data --------------------------- //
const { readFIle } = require("../utils/database");


// ------------------- GET functions

// return products
async function getProducts(req, res) {
    const file = await readFIle();


}


// ------------------- export functions --------------------- //
module.exports = { getProducts }