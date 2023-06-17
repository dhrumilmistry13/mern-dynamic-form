const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');
const orderController = require('../../controllers/frontend/order/frontend.order.controller');
const orderValidation = require('../../controllers/frontend/order/frontend.order.validation');

const router = express.Router();

router.get(
  '/patient-all-orders',
  jwt.verifyAccessToken,
  orderController.getPatientAllOrderDetails
);

router.get(
  '/patient-medical-intake',
  jwt.verifyAccessToken,
  orderController.getPatientMedicalIntakeDetails
);

router.get(
  '/patient-general-intake',
  jwt.verifyAccessToken,
  orderController.getPatientGeneralIntakeDetails
);

router.get(
  '/get-patient-order-detail',
  jwt.verifyAccessToken,
  orderController.getPatientOrderDetails
);

router.get(
  '/organization-all-orders',
  jwt.verifyAccessToken,
  orderController.getOrganizationAllOrderList
);

router.put(
  '/store-organization-order-note',
  jwt.verifyAccessToken,
  validate(orderValidation.storeOrganizationOrderNote(), {}, {}),
  orderController.storeOrganizationOrderNote
);
router.put(
  '/store-organization-order-charge',
  jwt.verifyAccessToken,
  validate(orderValidation.storeOrderChargeData(), {}, {}),
  orderController.storeOrderChargeData
);
router.put(
  '/store-organization-order-refund',
  jwt.verifyAccessToken,
  validate(orderValidation.storeOrderChargeData(), {}, {}),
  orderController.storeOrderRefundData
);
router.get(
  '/get-organization-order-note',
  jwt.verifyAccessToken,
  orderController.getOrganizationOrderNote
);

router.delete(
  '/delete-organization-order-note',
  jwt.verifyAccessToken,
  orderController.deleteOrganizationOrderNote
);

router.get(
  '/organization-order-transaction',
  jwt.verifyAccessToken,
  orderController.getOrganizationTransactionList
);

router.get(
  '/get-organization-order-detail',
  jwt.verifyAccessToken,
  orderController.getOrganizationOrderDetails
);

router.get(
  '/patient-order-transaction',
  jwt.verifyAccessToken,
  orderController.getPatientTransactionList
);

router.get(
  '/organization-medical-intake',
  jwt.verifyAccessToken,
  orderController.getOrganizationMedicalIntakeDetails
);

router.get(
  '/organization-general-intake',
  jwt.verifyAccessToken,
  orderController.getOrganizationGeneralIntakeDetails
);
router.get(
  '/get-patient-card',
  jwt.verifyAccessToken,
  orderController.getPatientOrderCardData
);
router.get(
  '/get-patient-recent-orders',
  jwt.verifyAccessToken,
  orderController.getPatientRecentOrders
);
router.get(
  '/place-order-pharmacy',
  jwt.verifyAccessToken,
  orderController.placeOrderPharmacy
);
router.get(
  '/order-item-rx-status-change',
  jwt.verifyAccessToken,
  orderController.OrderItemRxStatusChange
);
router.put(
  '/place-order-pharmacy-fill',
  jwt.verifyAccessToken,
  validate(orderValidation.pharmacyFillRequestStore(), {}, {}),
  orderController.OrderPlaceFillRequest
);
module.exports = router;
