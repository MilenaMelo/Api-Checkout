// ------------------- import data --------------------------- //
const { addBusinessDays } =  require('date-fns');

// ------------------- auxiliars functions

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

function validateUserData(data) {
    // validate type
    if (data.type !== 'individual') { return false; }

    // validate country
    if (data.country.length !== 2) { return false; }

    // validate name
    if (data.name.trim().split(' ').length < 2) { return false; }

    // validate document
    if (!data.documents || data.documents.length === 0) { return false; }

    // validate document
    if (data.documents[0].type !== 'cpf' || data.documents[0].number.length !== 11) { return false; }

    return true;
}


// ------------------- export functions --------------------- //
module.exports = { returnCalculatedCart, validateUserData }
