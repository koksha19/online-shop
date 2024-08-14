const express = require('express');

const productsController = require('../controllers/admin')

const router = express.Router();

router.get('/add-product', productsController.getAddProduct);
router.post('/add-product', productsController.postAddProduct);
router.get('/edit-product/:productId', productsController.getEditProduct);
router.post('/edit-product', productsController.postEditProduct);
router.get('/products', productsController.getAdminProducts);
router.post('/delete-product', productsController.postDelete);

module.exports = router;