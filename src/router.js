// ------------------- import data --------------------------- //
const express = require("express");
const properties = require("./controllers/properties");
const product = require("./controllers/product");
const cart = require("./controllers/cart");

const router = express();

// ------------------- routes


router.get('/produtos/estoque', properties.getStock);

// carrinho
router.get('/carrinho', properties.getCart);
router.post('/carrinho/produtos', properties.postProductsInCart);
router.patch('/carrinho/produtos/:id', properties.patchProductsInCart);
router.delete('/carrinho/produtos/:id', properties.deleteProductsInCart);
router.delete('/carrinho', properties.deleteAllProductsInCart);
router.post('/finalizar-compra', properties.checkout);

// ------------------- routes

// produto
router.get('/produtos', product.getProducts);

//carrinho
router.get('/carrinho', cart.addProducts);


// ------------------- export router
module.exports = router;