const express = require('express');

const router = express.Router();

const cmsController = require('../../controllers/frontend/cms/frontend.cms.controller');

router.get('/:cms_id', cmsController.getCMSpages);

module.exports = router;
