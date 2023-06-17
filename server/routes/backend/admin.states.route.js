const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();
const StatesController = require('../../controllers/backend/states/admin.states.controller');
const StatesValidation = require('../../controllers/backend/states/admin.states.validation');

router.post(
  '/add',
  jwt.verifyAccessToken,
  validate(StatesValidation.addStatesValidation(), {}, {}),
  StatesController.addStates
);

router.post(
  '/edit',
  jwt.verifyAccessToken,
  validate(StatesValidation.editStatesValidation(), {}, {}),
  StatesController.editStates
);

router.get('/get', jwt.verifyAccessToken, StatesController.getStates);

router.get('/list', jwt.verifyAccessToken, StatesController.listStates);

router.put(
  '/update-status/',
  jwt.verifyAccessToken,
  StatesController.updateStatusStates
);

router.delete('/delete', jwt.verifyAccessToken, StatesController.deleteStates);
module.exports = router;
