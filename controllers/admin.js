const Product = require("../models/product");
const { validationResult } = require("express-validator");

const returnErrorPage = require("../middleware/returnErrorPage");

const mongoose = require("mongoose");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: null,
    validationErrors: [],
    product: {
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      price: req.body.price,
    },
  });
};

exports.getAdminProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      returnErrorPage(err, next);
    });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;

  const product = new Product({
    _id: new mongoose.Types.ObjectId("66df081fd92102c687456059"),
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: req.user,
  });
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add product",
      path: "/admin/add-product",
      editing: false,
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      product: {
        title: product.title,
        imageUrl: product.imageUrl,
        description: product.description,
        price: product.price,
      },
    });
  }

  product
    .save()
    .then(() => {
      console.log("Created a product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      returnErrorPage(err, next);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit",
        path: "admin/edit-product",
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      returnErrorPage(err, next);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImage = req.body.imageUrl;
  const updatedDescription = req.body.description;
  const updatedPrice = req.body.price;
  const errors = validationResult(req);

  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      } else if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render("admin/edit-product", {
          pageTitle: "Edit",
          path: "/admin/edit-product",
          editing: true,
          product: {
            title: updatedTitle,
            imageUrl: updatedImage,
            description: updatedDescription,
            price: updatedPrice,
            _id: prodId,
          },
          isAuthenticated: req.session.isLoggedIn,
          errorMessage: errors.array()[0].msg,
          validationErrors: errors.array(),
        });
      }

      product.title = updatedTitle;
      product.price = updatedPrice;
      product.image = updatedImage;
      product.description = updatedDescription;

      return product.save().then(() => {
        console.log("Updated product");
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      returnErrorPage(err, next);
    });
};

exports.postDelete = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      returnErrorPage(err, next);
    });
};
