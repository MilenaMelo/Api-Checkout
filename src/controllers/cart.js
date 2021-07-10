// ------------------- import data --------------------------- //
const { fileReader, fileWriter } = require("../utils/database");
const { returnCalculatedCart, validateUserData, validateStok } = require('../utils/cart');


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

// delete cart
async function deleteCart(req, res) {
    const dataFile = await fileReader();

    // delete cart
    dataFile.carrinho = {
        produtos: [],
        subtoal: 0,
        dataDeEntrega: null,
        valorDoFrete: 0,
        totalAPagar: 0
    }

    // write in file
    const updateCart = await fileWriter(dataFile);

    if (!updateCart) {
        res.status(400).json({ mensagem: "Não foi possível excluir o carrinho." });
    }

    // return message
    return res.status(200).json({ mensagem: "O carrinho foi excluído com sucesso." }); 
}

// detail cart
async function detailCart(req, res) {
    const { carrinho } = await fileReader();

    // recalculate values cart 
    const calculatedCart = returnCalculatedCart(carrinho);
    return res.status(200).json(calculatedCart);
}

// complete purchase
async function completePurchase() {
    const payment = req.body;

    // read cart
    const dataFile = await fileReader();
    const { carrinho, produtos } = dataFile;

    // validate cart
    if (carrinho.produtos.length === 0) {
        return res.status(404).json({ mensagem: "O carrinho está vazio." });
    }

    // validate information in body
    if (!payment.customer) {
        return res.status(404).json({ mensagem: "Informe os dados." });
    }

    // validate user data
    const validatedUserData = validateUserData(payment.customer);

    if (!validatedUserData) {
        return res.status(404).json({ mensagem: "Os dados do usuário estão inválidos." });
    }

    const missingProducts = validateStok(carrinho, produtos);

    // check missing products
    if (missingProducts.length !== 0) {
        return res.status(404).json({ mensagem: "Existem produtos em falta no seu carrinho." });
    }

    // calculate total
    const calculatedCart = returnCalculatedCart(carrinho);

    for (const productInCart of carrinho.produtos) {
        const indexStockProduc = produtos.findIndex(produto => produto.id === productInCart.id);
    
        dataFile.produtos[indexStockProduc].estoque -= productInCart.quantidade;
    }

    // clear cart
    dataFile.carrinho = {
        produtos: [],
        subtoal: 0,
        dataDeEntrega: null,
        valorDoFrete: 0,
        totalAPagar: 0
    }

    // write in file
    const updateFile = await fileWriter(dataFile);

    if (!updateFile) {
        res.status(400).json({ mensagem: "Falha no processamento do estoque." });
    }

    // return message
    return res.status(200).json({ mensagem: "Compra efetuada com sucesso.", carrinho: calculatedCart });
}



// ------------------- export functions --------------------- //
module.exports = { 
    addProducts,
    editAmountProducts,
    deleteProduct,
    deleteCart,
    detailCart,
    completePurchase
}