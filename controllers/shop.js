const Product = require('../models/product');
const Order = require('../models/order');

exports.getShop = (req, res) => {
    Product
        .find()
        .then((products) => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Products',
                path: '/products',
                isAuthenticated: req.session.isLoggedIn,
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
                path: '/products',
                isAuthenticated: req.session.isLoggedIn,
            });
        })
        .catch(err => console.log(err));
}

exports.getMainPage = (req, res) => {
    Product
        .find()
        .then((products) => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                isAuthenticated: req.session.isLoggedIn,
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getCart = (req, res) => {
    req.session.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                products: products,
                isAuthenticated: req.session.isLoggedIn,
            });
        })
        .catch(err => console.log(err));
}

exports.postCart = (req, res) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.session.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        });

}

exports.postDeleteCartItem = (req, res) => {
    const prodId = req.body.productId;
    req.session.user
        .deleteItem(prodId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.postOrder = (req, res) => {
    req.session.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i => {
                return {
                    quantity: i.quantity,
                    product: { ...i.productId._doc },
                }
            });
            const order = new Order({
                user: {
                    name: req.session.user.name,
                    userId: req.session.user,
                },
                products: products,
            });
            return order.save();
        })
        .then(() => {
            return req.session.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res) => {
    Order.find({ 'user.userId': req.session.user._id })
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Orders',
                path: '/orders',
                orders: orders,
                isAuthenticated: req.session.isLoggedIn,
            });
        })
        .catch(err => console.log(err));
}


