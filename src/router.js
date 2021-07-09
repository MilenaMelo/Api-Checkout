// ------------------- import data --------------------------- //
const express = require("express");
const properties = require("./controllers/properties");
const product = require("./controllers/product");


const router = express();

// ------------------- routes

// produto
router.get('/produtos', product.getProducts);
router.get('/produtos/estoque', properties.getStock);

// carrinho
router.get('/carrinho', properties.getCart);
router.post('/carrinho/produtos', properties.postProductsInCart);
router.patch('/carrinho/produtos/:id', properties.patchProductsInCart);
router.delete('/carrinho/produtos/:id', properties.deleteProductsInCart);
router.delete('/carrinho', properties.deleteAllProductsInCart);
router.post('/finalizar-compra', properties.checkout);


// ------------------- export router
module.exports = router;