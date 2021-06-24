// ------------------- import data --------------------------- //
const express = require("express");
const properties = require("./controllers/properties");

const router = express();

// ------------------- routes

router.get('/produtos', properties.getProducts);
router.get('/produtos/estoque', properties.getStock);
router.get('/carrinho', properties.getCart);
router.post('/carrinho/produtos', properties.postProductsInCart);
router.patch('/carrinho/produtos/:id', properties.patchProductsInCart);
router.delete('/carrinho/produtos/:id', properties.deleteProductsInCart);
router.delete('/carrinho', properties.deleteAllProductsInCart);
router.post('/carrinho/finalizar-compra', properties.checkout);


// ------------------- export router
module.exports = router;