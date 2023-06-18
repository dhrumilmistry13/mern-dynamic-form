const db = require("../models");
const Question = db.question;

// Create and Save a new Question
exports.create = (req, res) => {
  // Create a question
  const question = new Question({
    question: req.body.question,
    is_required: req.body.is_required,
    question_type: req.body.question_type,
    sequence: req.body.sequence,
    status: req.body.sequence
  });

  // Save question in the database
  question
    .save(question)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Question."
      });
    });

};

// Retrieve all Question from the database.
exports.findAll = (req, res) => {
    const question = req.query.question;
    var condition = question ? { question: { $regex: new RegExp(question), $options: "i" } } : {};
    // var condition = {};
    Question.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving question."
        });
      });
};

// Find a single Question with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Question.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found question with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving question with id=" + id });
      });
};

// Update a Question by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
      }
    
      const id = req.params.id;
    
      Question.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update Question with id=${id}. Maybe Question was not found!`
            });
          } else res.send({ message: "Question was updated successfully." });
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating Question with id=" + id
          });
        });
};

// Delete a Question with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Question.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Question with id=${id}. Maybe Tutorial was not found!`
          });
        } else {
          res.send({
            message: "Question was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Question with id=" + id
        });
      });
};