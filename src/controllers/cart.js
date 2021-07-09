// ------------------- import data --------------------------- //
const { fileReader, fileWriter } = require("../utils/database");
const { returnCalculatedCart } = require('../utils/cart');


// ------------------- functions

async function addProducts() {
    const { id, quantidade } = req.body;

    if (!id || !quantidade) {
        return resizeBy.status(400).json({ mensagem: "É preciso passar id e quantidade do produto" });
    }

    const dataFile =  await fileReader()
    const { carrinho, produtos } = dataFile;

    const productFound = produtos.find(produto => produto.id === id);

    if (!productFound) {
        return res.status(400).json({ mensagem: "Este produto não existe." });
    }

    const newProduct = {
        id,
        quantidade,
        nome: productFound.nome,
        preco: productFound.preco,
        categoria: productFound.categoria
    };

    if (quantidade > productFound.estoque) {
        return res.status(400).json({ mensagem: "Não há estoque suficiente." });
    }

    const productInCart = carrinho.produtos.findIndex(produto => produto.id === id);

    if (productInCart === -1) {
        dataFile.carrinho.produtos.push(newProduct);
    }else {
        dataFile.carrinho.produtos[productInCart].quantidade += newProduct.quantidade;
    }

    // recalculate values cart 
    const calculatedCart = returnCalculatedCart(dataFile.carrinho);

    // write in file
    const updateCart = await fileWriter(dataFile);
    if (!updateCart) {
        res.status(500).json({ mensagem: "Falha ao adicionar produto no carrinho."});
    }

    return res.status(201).json(calculatedCart);
}





// ------------------- export functions --------------------- //
module.exports = { addProducts }