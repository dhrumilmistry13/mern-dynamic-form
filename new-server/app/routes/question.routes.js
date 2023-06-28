module.exports = app => {
    const question = require("../controllers/question.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Question
    router.post("/", question.create);
  
    // Retrieve all question
    router.get("/", question.findAll);
  
    router.get("/active", question.getAllActiveQuestion);

    // Retrieve a single Question with id
    router.get("/:id", question.findOne);
  
    // Update a Question with id
    router.put("/:id", question.update);
  
    // Delete a Question with id
    router.delete("/:id", question.delete);
    
    // Update Question Status
    router.post("/update-status/:id", question.statusUpdate);
    
    // Update Question Status
    router.post("/submit-question", question.saveQuestionData);
  
    app.use('/api/question', router);
  };