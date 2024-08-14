const express = require('express');

const productsController = require('../controllers/shop');

const router = express.Router();

router.get('/', productsController.getMainPage);
router.get('/products', productsController.getShop);
router.get('/products/:productId', productsController.getProduct);
router.get('/cart', productsController.getCart);
router.post('/cart', productsController.postCart);
router.post('/cart-delete-item', productsController.postDeleteCartItem);
router.post('/create-order', productsController.postOrder);
router.get('/orders', productsController.getOrders);

module.exports = router;
