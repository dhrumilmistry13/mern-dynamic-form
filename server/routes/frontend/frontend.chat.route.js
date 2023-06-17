const express = require('express');

const router = express.Router();
const { multerUploads } = require('../../helpers/s3file.helper');
const jwt = require('../../middleware/jwt.helper');
const chatController = require('../../controllers/frontend/chat/frontend.chat.controller');

router.get(
  '/get-patient-room',
  jwt.verifyAccessToken,
  chatController.getPatientUserChatList
);
router.get(
  '/get-org-user-list',
  jwt.verifyAccessToken,
  chatController.getOrganizationUserChatList
);
router.get(
  '/get-org-user-list-search',
  jwt.verifyAccessToken,
  chatController.getOrganizationUserChatListSearch
);
router.get(
  '/get-org-chat-count',
  jwt.verifyAccessToken,
  chatController.getOrgUnreadMessageCount
);
router.get(
  '/get-org-chat-list',
  jwt.verifyAccessToken,
  chatController.getOrganizationChatList
);
router.get(
  '/get-patient-chat-list',
  jwt.verifyAccessToken,
  chatController.getPatientChatList
);
router.post(
  '/store',
  jwt.verifyAccessToken,
  multerUploads,
  chatController.userChatMessageSend
);
module.exports = router;
