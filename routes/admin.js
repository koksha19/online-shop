const express = require("express");
const { check } = require("express-validator");

const productsController = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

const productValidators = [
  check("title")
    .isLength({ min: 5, max: 30 })
    .withMessage("A title has to be 5 to 30 characters long")
    .trim(),
  check("description")
    .isLength({ min: 15 })
    .withMessage("The description should contain at lease 15 characters"),
  check("price").isNumeric().withMessage("Price has to be a number"),
];

router.get("/add-product", isAuth, productsController.getAddProduct);

router.post(
  "/add-product",
  productValidators,
  isAuth,
  productsController.postAddProduct,
);

router.get(
  "/edit-product/:productId",
  isAuth,
  productsController.getEditProduct,
);

router.post(
  "/edit-product",
  productValidators,
  isAuth,
  productsController.postEditProduct,
);

router.get("/products", isAuth, productsController.getAdminProducts);

router.post("/delete-product", isAuth, productsController.postDelete);

module.exports = router;
