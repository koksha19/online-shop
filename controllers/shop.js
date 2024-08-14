const Product = require('../models/product');

exports.getShop = (req, res, next) => {
    Product
        .fetchAll()
        .then((products) => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Products',
                path: '/products',
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getProduct = (req, res) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: 'Details',
                path: '/products'
            });
        })
        .catch(err => console.log(err));
}

exports.getMainPage = (req, res) => {
    Product
        .fetchAll()
        .then((products) => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getCart = (req, res) => {
    req.user
        .getCart()
        .then(products => {
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                products: products,
            });
        })
        .catch(err => console.log(err));
}

exports.postCart = (req, res) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        });

}

exports.postDeleteCartItem = (req, res) => {
    const prodId = req.body.productId;
    req.user
        .deleteItem(prodId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.postOrder = (req, res) => {
    req.user
        .addOrder()
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res) => {
    req.user
        .getOrders( )
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Orders',
                path: '/orders',
                orders: orders,
            });
        })
        .catch(err => console.log(err));
}


