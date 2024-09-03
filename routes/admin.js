const express = require('express');

const productsController = require('../controllers/admin')
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/add-product', isAuth, productsController.getAddProduct);
router.post('/add-product', isAuth, productsController.postAddProduct);
router.get('/edit-product/:productId', isAuth, productsController.getEditProduct);
router.post('/edit-product', isAuth, productsController.postEditProduct);
router.get('/products', isAuth, productsController.getAdminProducts);
router.post('/delete-product', isAuth, productsController.postDelete);

module.exports = router;