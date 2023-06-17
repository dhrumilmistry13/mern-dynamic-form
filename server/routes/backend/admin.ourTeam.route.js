const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();
const ourTeamController = require('../../controllers/backend/ourteam/admin.ourTeam.controller');
const OurTeamValidattion = require('../../controllers/backend/ourteam/admin.ourteam.validation');
const { multerUploads } = require('../../helpers/s3file.helper');

router.post(
  '/add',
  multerUploads,
  jwt.verifyAccessToken,
  validate(OurTeamValidattion.addOurTeamValidation(), {}, {}),
  ourTeamController.addOurTeam
);
router.post(
  '/edit',
  multerUploads,
  jwt.verifyAccessToken,
  validate(OurTeamValidattion.editOurTeamValidation(), {}, {}),
  ourTeamController.editOurTeam
);
router.put(
  '/update-status/',
  jwt.verifyAccessToken,
  ourTeamController.updateStatusOurTeam
);
router.get('/get', jwt.verifyAccessToken, ourTeamController.getOurTeam);
router.get('/list', jwt.verifyAccessToken, ourTeamController.listOurTeam);
router.delete(
  '/delete/',
  jwt.verifyAccessToken,
  ourTeamController.deleteOurTeam
);
module.exports = router;
