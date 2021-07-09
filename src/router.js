// ------------------- import data --------------------------- //
const express = require("express");
const product = require("./controllers/product");
const cart = require("./controllers/cart");

const router = express();

// ------------------- routes

// produto
router.get('/produtos', product.getProducts);

//carrinho
router.post('/carrinho/produtos/', cart.addProducts);
router.patch('/carrinho/produtos/:id', cart.editAmountProducts);
router.delete('/carrinho/produtos/:id', cart.deleteProduct);


// ------------------- export router
module.exports = router;