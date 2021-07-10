// ------------------- import data --------------------------- //
const { fileReader, fileWriter } = require("../utils/database");
const { returnCalculatedCart } = require('../utils/cart');


// ------------------- functions

// add products
async function addProducts(req, res) {
    const { id, quantidade } = req.body;

    if (!id || !quantidade) {
        return res.status(400).json({ mensagem: "É preciso passar id e quantidade do produto" });
    }

    const dataFile = await fileReader();
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
    } else {
        dataFile.carrinho.produtos[productInCart].quantidade += newProduct.quantidade;
    }

    // recalculate values cart 
    const calculatedCart = returnCalculatedCart(dataFile.carrinho);

    // write in file
    const updateCart = await fileWriter(dataFile);

    if (!updateCart) {
        res.status(500).json({ mensagem: "Falha ao adicionar produto no carrinho." });
    }

    return res.status(200).json(calculatedCart);
}

// edit amount products
async function editAmountProducts(req, res) {
    const { quantidade } = req.body;
    const id = parseInt(req.params.id);

    if (!id || !quantidade) {
        return res.status(400).json({ mensagem: "É preciso passar id e quantidade do produto" });
    }

    const dataFile = await fileReader();
    const { carrinho, produtos } = dataFile;

    const productFound = produtos.find(produto => produto.id === id);

    if (!productFound) {
        return res.status(400).json({ mensagem: "Este produto não existe." });
    }

    const productIndexInCart = carrinho.produtos.findIndex(produto => produto.id === id);

    if (productIndexInCart === -1) {
        return res.status(404).json({ mensagem: "Este produto não está no carrinho." });
    }

    if (quantidade + carrinho.produtos[productIndexInCart].quantidade > productFound.estoque) {
        return res.status(400).json({ mensagem: "Esse produto não tem estoque suficiente." });
    }

    if (quantidade + carrinho.produtos[productIndexInCart].quantidade < 0) {
        return res.status(400).json({ mensagem: "Limite de redução da quantidade de produto no carrinho." });
    }

    dataFile.carrinho.produtos[productIndexInCart].quantidade += quantidade;

    if (carrinho.produtos[productIndexInCart].quantidade === 0) {
        dataFile.carrinho.produtos.splice(productIndexInCart, 1);
    }

    // write in file
    const updateCart = await fileWriter(dataFile);

    if (!updateCart) {
        res.status(400).json({ mensagem: "Falha ao atualizar a quantidade de produtos." });
    }

    // recalculate values cart 
    const calculatedCart = returnCalculatedCart(dataFile.carrinho);

    return res.status(200).json(calculatedCart);

}

// delete product
async function deleteProduct(req, res) {
    const id = parseInt(req.params.id);

    const dataFile = await fileReader();
    const { carrinho } = dataFile;

    const productIndexInCart = carrinho.produtos.findIndex(produto => produto.id === id);

    if (productIndexInCart === -1) {
        return res.status(404).json({ mensagem: "Este produto não está no carrinho." });
    }

    dataFile.carrinho.produtos.splice(productIndexInCart, 1);

    // write in file
    const updateCart = await fileWriter(dataFile);

    if (!updateCart) {
        res.status(400).json({ mensagem: "Falha ao atualizar a quantidade de produtos." });
    }

    // recalculate values cart 
    const calculatedCart = returnCalculatedCart(dataFile.carrinho);

    return res.status(200).json(calculatedCart);

}

// ------------------- export functions --------------------- //
module.exports = { 
    addProducts,
    editAmountProducts,
    deleteProduct
}