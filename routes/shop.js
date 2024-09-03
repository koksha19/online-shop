const express = require('express');

const productsController = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/', productsController.getMainPage);
router.get('/products', productsController.getShop);
router.get('/products/:productId', productsController.getProduct);
router.get('/cart', isAuth, productsController.getCart);
router.post('/cart', isAuth, productsController.postCart);
router.post('/cart-delete-item', isAuth, productsController.postDeleteCartItem);
router.post('/create-order', isAuth, productsController.postOrder);
router.get('/orders', isAuth, productsController.getOrders);

module.exports = router;
