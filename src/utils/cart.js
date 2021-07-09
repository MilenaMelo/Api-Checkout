// ------------------- import data --------------------------- //
const { addBusinessDays } =  require('date-fns');

// ------------------- functions

function returnCalculatedCart(carrinho) {
    const BASE_FREIGHT_PRICE = 5000;
    const VALUE_PURCHASE_FREE_SHIPPING = 20000;

    let subtotal = 0;

    carrinho.produtos.forEach(produto => {
        subtotal += produto.preco * produto.quantidade;
    });

    let dataDeEntrega = addBusinessDays(Date.now(), 15);
    const valorDoFrete = (subtotal > VALUE_PURCHASE_FREE_SHIPPING || carrinho.produtos.length === 0) ? 0 : BASE_FREIGHT_PRICE;     
    const totalAPagar = subtotal + valorDoFrete;

    const calculatedCart = {
        subtotal,
        dataDeEntrega,
        valorDoFrete,
        totalAPagar,
        produtos: carrinho.produtos
    }

    return calculatedCart;
}



// ------------------- export functions --------------------- //
module.exports = { returnCalculatedCart }
