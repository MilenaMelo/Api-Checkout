// ------------------- import data --------------------------- //
const express = require("express");
const product = require("./controllers/product");
const cart = require("./controllers/cart");

const router = express();

// ------------------- routes

// produto
router.get('/produtos', product.getProducts);

//carrinho
router.get('/carrinho', cart.detailCart);
router.post('/carrinho/produtos/', cart.addProducts);
router.patch('/carrinho/produtos/:id', cart.editAmountProducts);
router.delete('/carrinho/produtos/:id', cart.deleteProduct);
router.delete('/carrinho', cart.deleteCart);
router.post('/finalizar-carrinho', cart.completePurchase);


// ------------------- export router
module.exports = router;