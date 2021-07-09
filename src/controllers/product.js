// ------------------- import data --------------------------- //
const { fileReader } = require("../utils/database");


// ------------------- GET functions

// return products
async function getProducts(req, res) {
    let { produtos } = await fileReader();
    const { categoria, precoInicial, precoFinal } = req.query;

    products = produtos.filter(produto => produto.estoque > 0);

    // case empty array
    if (!produtos) {
        return res.status(200).json([]);
    }

    // valid case array
    if (categoria) {
        products = produtos.filter(produto => produto.categoria.toLowerCase() === categoria.toLowerCase());
    }

    if (precoInicial) {
        products = produtos.filter(produto => produto.preco >= precoInicial);
    }

    if (precoFinal) {
        products = produtos.filter(produto => produto.preco <= precoFinal);
    }

    // return array according
    return res.status(200).json(products);
}


// ------------------- export functions --------------------- //
module.exports = { getProducts }