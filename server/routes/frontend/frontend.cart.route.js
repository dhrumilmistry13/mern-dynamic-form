const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();
const cartController = require('../../controllers/frontend/cart/frontend.cart.controller');
const cartValidation = require('../../controllers/frontend/cart/frontend.cart.validation');

router.get(
  '/get-formulary-details',
  jwt.verifyAccessToken,
  cartController.getProductDetails
);

router.put(
  '/store-formularydata',
  jwt.verifyAccessToken,
  validate(cartValidation.storeFormularyDetailsValidation(), {}, {}),
  cartController.StoreAddCartFormularyDetails
);

router.get(
  '/get-formulary-list',
  jwt.verifyAccessToken,
  cartController.getProductListDetails
);
router.put(
  '/store-cart-address',
  jwt.verifyAccessToken,
  validate(cartValidation.storeOrderAddressDataValidation(), {}, {}),
  cartController.storeOrderAddressData
);
router.get(
  '/get-cart-address',
  jwt.verifyAccessToken,
  cartController.getOrderAddressData
);

router.get(
  '/get-order-details',
  jwt.verifyAccessToken,
  cartController.getOrderData
);

router.delete(
  '/delete-order-item',
  jwt.verifyAccessToken,
  cartController.deleteOrderItemData
);

module.exports = router;
