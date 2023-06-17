const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();
const TransactionController = require('../../controllers/backend/transaction/admin.transaction.controller');
const TransactionValidattion = require('../../controllers/backend/transaction/admin.transaction.validation');

router.get(
  '/organization-list',
  jwt.verifyAccessToken,
  TransactionController.getOrganizationData
);
router.get(
  '/order-refund-item-list',
  jwt.verifyAccessToken,
  TransactionController.getOrderItemRefundData
);
router.get(
  '/organization-refund-list',
  jwt.verifyAccessToken,
  TransactionController.getOrganizationRefundData
);

router.get(
  '/order-transaction-list',
  jwt.verifyAccessToken,
  TransactionController.getOrderTransactionData
);
router.get(
  '/order-refund-list',
  jwt.verifyAccessToken,
  TransactionController.getOrderRefundData
);
router.get(
  '/subscription-transaction-list',
  jwt.verifyAccessToken,
  TransactionController.getSubscriptionTransactionData
);
router.put(
  '/store-note',
  jwt.verifyAccessToken,
  validate(
    TransactionValidattion.storeOrderTransactionDataValidation(),
    {},
    {}
  ),
  TransactionController.storeOrderTransactionData
);

router.get(
  '/patient-list',
  jwt.verifyAccessToken,
  TransactionController.getPatientData
);

router.get(
  '/patient-refund-list',
  jwt.verifyAccessToken,
  TransactionController.getPatientrefundData
);
module.exports = router;
