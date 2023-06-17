const express = require('express');
const { validate } = require('express-validation');
const jwt = require('../../middleware/jwt.helper');

const router = express.Router();
const QuestionController = require('../../controllers/frontend/question/frontend.question.controller');
const QuestionValidation = require('../../controllers/frontend/question/frontend.question.validation');

router.get(
  '/get-business',
  jwt.verifyAccessToken,
  QuestionController.getBusinessQuestions
);
router.get(
  '/get-intake',
  jwt.verifyAccessToken,
  QuestionController.getIntakeQuestions
);
router.get(
  '/get-formulry',
  jwt.verifyAccessToken,
  QuestionController.getFormulryQuestions
);
router.get(
  '/get-formulary-questionnair',
  jwt.verifyAccessToken,
  QuestionController.getFormulryQuestionnair
);
router.put(
  '/store-intake',
  jwt.verifyAccessToken,
  validate(QuestionValidation.addQuestionValidation(), {}, {}),
  QuestionController.storeUpdateIntakeQuestions
);
router.put(
  '/store-deleted-intake',
  jwt.verifyAccessToken,
  validate(QuestionValidation.addQuestionValidation(), {}, {}),
  QuestionController.storeIntakeQuestionAsDeleted
);

router.delete(
  '/delete-intake',
  jwt.verifyAccessToken,
  QuestionController.deleteIntakeQuestions
);
router.put(
  '/add-business-ans',
  jwt.verifyAccessToken,
  validate(QuestionValidation.addBusinessQuestionsAns(), {}, {}),
  QuestionController.storeBusinessQuestionsAns
);
router.get(
  '/get-business-ans',
  jwt.verifyAccessToken,
  QuestionController.getBusinessQuestionsAns
);
router.get(
  '/get-formulary-ans',
  jwt.verifyAccessToken,
  QuestionController.getFormulryPatientQuestion
);
router.get(
  '/get-checkout-intake-ans',
  jwt.verifyAccessToken,
  QuestionController.getCheckOutIntakePatientQuestion
);
router.put(
  '/add-formulary-ans',
  jwt.verifyAccessToken,
  validate(QuestionValidation.addFormularyPatientQuestionsAns(), {}, {}),
  QuestionController.storeFormularyPatientQuestionsAns
);
router.put(
  '/store-madication',
  jwt.verifyAccessToken,
  validate(QuestionValidation.addMadicationQuestionValidation(), {}, {}),
  QuestionController.storeUpdateMedicationQuestions
);
router.put(
  '/add-checkout-intake-ans',
  jwt.verifyAccessToken,
  validate(QuestionValidation.addCheckoutIntakePatientQuestionsAns(), {}, {}),
  QuestionController.storeCheckOutIntakePatientQuestionsAns
);

router.delete(
  '/delete-madication',
  jwt.verifyAccessToken,
  QuestionController.deleteMedicationQuestions
);
module.exports = router;
