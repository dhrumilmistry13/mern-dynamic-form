module.exports = app => {
    const formQuestion = require("../controllers/form.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all formQuestion
    router.get("/", formQuestion.findAll);
  
    // Retrieve a single formQuestion with id
    router.get("/:id", formQuestion.findOne);
  
    // Delete a formQuestion with id
    router.delete("/:id", formQuestion.delete);

    // Update formQuestion Status
    router.post("/submit-question", formQuestion.saveQuestionData);
  
    app.use('/api/question-form', router);
  };