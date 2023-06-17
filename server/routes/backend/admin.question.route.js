const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();
const QuestionController = require('../../controllers/backend/question/admin.question.controller');
const QuestionValidattion = require('../../controllers/backend/question/admin.question.validation');

router.put(
  '/add',
  jwt.verifyAccessToken,
  validate(QuestionValidattion.addQuestionValidation(), {}, {}),
  QuestionController.addQuestions
);
router.put(
  '/edit',
  jwt.verifyAccessToken,
  validate(QuestionValidattion.editQuestionValidation(), {}, {}),
  QuestionController.editQuestions
);
router.put(
  '/update-status/',
  jwt.verifyAccessToken,
  QuestionController.updateStatusQuestions
);
router.get('/get', jwt.verifyAccessToken, QuestionController.getQuestions);
router.get('/list', jwt.verifyAccessToken, QuestionController.listQuestions);
router.delete(
  '/delete/',
  jwt.verifyAccessToken,
  QuestionController.deleteQuestions
);

router.get(
  '/organization-business-question-detail',
  jwt.verifyAccessToken,
  QuestionController.getOrganizationBusinessQuestionDetails
);

router.get(
  '/organization-intake-question-detail',
  jwt.verifyAccessToken,
  QuestionController.getOrganizationIntakeQuestionsDetails
);

router.get(
  '/patient-signup-question-detail',
  jwt.verifyAccessToken,
  QuestionController.getPatientSignupQuestionsDetails
);

router.get(
  '/patient-insurance-question-detail',
  jwt.verifyAccessToken,
  QuestionController.getPatientInsuranceQuestionsDetails
);

router.delete(
  '/delete/question',
  jwt.verifyAccessToken,
  QuestionController.deleteQuestion
);
module.exports = router;
