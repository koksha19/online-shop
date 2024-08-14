const mongodb = require('mongodb');

const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add product',
        path: '/admin/add-product',
        editing: false,
    });
};

exports.getAdminProducts = (req, res) => {
    Product
        .fetchAll()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin products',
                path: '/admin/products',
            });
        })
        .catch(err => console.log(err));
}

exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const product = new Product(title, price, description, imageUrl, null, req.user._id);
    product
        .save()
        .then(() => {
            console.log('Created a product');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res) => {
    const editMode = req.query.edit;
    if(!editMode) {
        res.redirect('/');
    }
    const prodId = req.params.productId;
    Product
        .findById(prodId)
        .then(product => {
            if (!product) {
                res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit',
                path: 'admin/edit-product',
                editing: editMode,
                product: product,
            });
        })
        .catch(err => console.log(err));
}

exports.postEditProduct = (req, res) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImage = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    const product = new Product(updatedTitle, updatedPrice, updatedDescription, updatedImage, prodId);
        product
        .save()
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

exports.postDelete = (req, res) => {
    const prodId = req.body.productId;
    Product
        .deleteById(prodId)
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}
