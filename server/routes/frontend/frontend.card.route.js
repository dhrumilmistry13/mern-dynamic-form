const express = require('express');

const router = express.Router();
const jwt = require('../../middleware/jwt.helper');
const cardController = require('../../controllers/frontend/card/frontend.card.controller');
const frontendCardController = require('../../controllers/frontend/card/frontend.card.controller');

router.post('/add', jwt.verifyAccessToken, cardController.addCard);
router.get('/get', jwt.verifyAccessToken, frontendCardController.getListCard);
router.delete(
  '/delete',
  jwt.verifyAccessToken,
  frontendCardController.deleteCard
);
router.put(
  '/default',
  jwt.verifyAccessToken,
  frontendCardController.defaultCard
);

module.exports = router;
