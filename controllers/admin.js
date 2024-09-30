const Product = require("../models/product");
const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: null,
    validationErrors: [],
    input: {
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      price: req.body.price,
    },
  });
};

exports.getAdminProducts = (req, res) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;

  const product = new Product({
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
      input: {
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
      console.log(err);
    });
};

exports.getEditProduct = (req, res) => {
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
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res) => {
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
          product: product,
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
    .catch((err) => console.log(err));
};

exports.postDelete = (req, res) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
