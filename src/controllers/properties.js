// ------------------- import data --------------------------- //
const properties = require("../database/data.json");


// ------------------- GET functions

// return products
function getProducts(req, res) {
    const categoria = req.query.categoria;
    const precoInicial = req.query.precoInicial;
    const precoFinal = req.query.precoFinal;

    // return products by category
    if (categoria) {
        if (precoInicial && precoFinal) {
            const products = properties.produtos.filter((product) => product.preco >= precoInicial && product.preco <= precoFinal);
            const filtered = products.filter((product) => product.estoque > 0 && product.categoria === categoria);
            if (products.length !== 0 ? res.send(filtered) : res.json({ erro: 'não existe produtos nesta categoria com essa faixa de preço' }));
        } else {
            const products = properties.produtos.filter((product) => product.categoria === categoria);
            const filtered = products.filter((product) => product.estoque > 0);
            if (products.length !== 0 ? res.send(filtered) : res.json({ erro: 'Não existe produtos nesta categoria' }));
        }
    }

    // return products by preco
    else if (precoInicial && precoFinal) {
        const products = properties.produtos.filter((product) => product.preco >= precoInicial && product.preco <= precoFinal);
        const filtered = products.filter((product) => product.estoque > 0);
        if (products.length !== 0 ? res.send(filtered) : res.json({ erro: 'não existe produtos com essa faixa de preço' }));
    }

    // return all products
    else { res.send(properties.produtos); }

}

// return products in stok
function getStock(req, res) {
    const products = properties.produtos.filter((product) => product.estoque > 0);
    if (products.length !== 0 ? res.send(products) : res.json({ erro: 'Não existe produtos em estoque' }));
}

// return products in stok
function getCart(req, res) {
    res.json(properties.carrinho)
}

// ------------------- POST functions

const carrinho = properties.carrinho;

// post products in cart
function postProductsInCart(req, res) {
    const id = req.body.id;
    const quantidade = req.body.quantidade;
    const product = properties.produtos.filter((product) => product.id === id)[0];
    const productInList = carrinho.produtos.filter((product) => product.id === id);

    if (product) {

        if (product.estoque > 0) {

            if (productInList.length === 0) {
                const newProduct = {
                    id: product.id,
                    quantidade: quantidade,
                    nome: product.nome,
                    preco: product.preco,
                    categoria: product.categoria
                }

                carrinho.produtos.push(newProduct);
                carrinho.subtotal = quantidade * product.preco;
                carrinho.dataDeEntrega = new Date();
                carrinho.valorDoFrete = calculateFrete(product.preco);
                carrinho.totalAPagar = carrinho.subtotal + carrinho.valorDoFrete;

                product.estoque--;
                res.json(carrinho);

            } else {
                const productInCart = carrinho.produtos.find(product => product.id === id);
                productInCart.quantidade = productInCart.quantidade + quantidade;

                carrinho.subtotal = productInCart.quantidade * product.preco;
                carrinho.dataDeEntrega = new Date();
                carrinho.valorDoFrete = calculateFrete(carrinho.subtotal);
                carrinho.totalAPagar = carrinho.subtotal + carrinho.valorDoFrete;
                product.estoque--;
                res.json(carrinho);
            }

        } else { res.json({ erro: "Este produto não está disponível" }) }

    } else {
        res.json(carrinho);
    }
}

function calculateFrete(preco) {
    return preco <= 20000 ? 5000 : 0;
}

function checkout(req, res) {
    const type = req.body.type;
    const country = req.body.country;
    const name = req.body.name;
    const arrayName = name.split(' ');
    const documents  = req.body.documents;

    if(carrinho.produtos.length > 0){
        if(country.length === 2 && type === 'individual' && arrayName.length === 2 && documents[0].type === 'cpf' && documents[0].number.length === 11){
            carrinho.produtos.splice(0, carrinho.produtos.length);
            res.json({ mensagem: "SUa compra foi finalizada com sucesso!" }) 
        } res.json({ erro: "Dados incorretos" })

    }else { res.json({ erro: "O carrinho está vazio" }) }
    
}

// ------------------- PATCH functions

function patchProductsInCart(req, res) {
    const id = req.params.id;
    const quantidade = req.body.quantidade;
    const product = properties.produtos.find(product => product.id === Number(id));
    const productInCart = carrinho.produtos.find(product => product.id === Number(id));

    if (carrinho.produtos.length != 0 && productInCart !== undefined) {
        if (quantidade != undefined && product.estoque > 0 && quantidade <= product.estoque) {
            productInCart.quantidade = productInCart.quantidade + quantidade;
            product.estoque--;
            res.json(carrinho);
        } else { res.json({ erro: "Informe a quantidade correta" }) }


    } else { res.json({ erro: "Não possui produto no carrinho" }) }

}


// ------------------- DELETE functions

function deleteProductsInCart(req, res) {
    const id = req.params.id;
    const productInCart = carrinho.produtos.find(product => product.id === Number(id));


    if(id !== undefined && productInCart !== undefined) {

        const indice = carrinho.produtos.indexOf(productInCart);
        carrinho.produtos.splice(indice, 1);

        res.json({ "mensagem": "Livro removido.", carrinho: carrinho })
    } else { res.json({ erro: "Não possui este produto no carrinho" }) }
}


function deleteAllProductsInCart(req, res) {
   carrinho.produtos.splice(0, carrinho.produtos.length);
   res.json({ "mensagem": "Livro removido." });
}




// ------------------- export functions --------------------- //
module.exports = {
    getProducts,
    getStock,
    getCart,
    postProductsInCart,
    patchProductsInCart,
    deleteProductsInCart,
    deleteAllProductsInCart,
    checkout
}