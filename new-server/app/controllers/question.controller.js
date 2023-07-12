const db = require("../models");
const Question = db.question;
const QuestionForm = db.questionForm;

// Create and Save a new Question
exports.create = (req, res) => {
  // Create a question
  const question = new Question({
    question: req.body.label,
    is_required: req.body.is_required === 1 ? true : false,
    question_type: req.body.question_type,
    sequence: req.body.sequence,
    status: req.body.status === 1 ? true : false,
    question_options: req.body.question_options
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
exports.findAll = async(req, res) => {
  let {page, serach_text} = req.query;
    var condition = serach_text ? { question: { $regex: new RegExp(serach_text), $options: "i" } } : {};
    if(!page){
      page=1;
    }
    const q = Question.find(condition);
    let count = await q.count();
    let last_page = count/10;
    last_page = last_page % 10 === 0 ? Math.round(last_page) : Math.round(last_page)+1;

    Question.find(condition).skip((page-1)*10).limit(10)
      .then(data => {
        res.send({data:{
          question_list: data,
          pagination: {
              "last_page": last_page
          }
        },
      message:"get list done"});
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
        else {
          res.send({data: data, message: 'Question data fetch'});
        }
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
      req.body.status= req.body.status === 1 ? true : false;
      req.body.is_requiredx= req.body.is_requiredx === 1 ? true : false;

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
            message: `Cannot delete Question with id=${id}. Maybe Question was not found!`
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

// Question Satus Update with the specified id in the request
exports.statusUpdate = (req, res) => {
  const id = req.params.id;
  let status = req.body.status;
status = status === "1" ? true: false;
  Question.findByIdAndUpdate(id, {status: status}, { useFindAndModify: false })
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

exports.getAllActiveQuestion = async(req, res) =>  {
  var condition = {status: true};
  Question.find(condition).sort({sequence:1})
    .then(data => {
      data = data.map((value, index)=>{
        value.is_required = value.is_required ? 1 : 2;
        value.status = value.status ? 1 : 2;
        return value;
      });
      res.send({data:data,message:"get All Active Question"});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving question."
      });
    });
};

exports.saveQuestionData = async(req, res)=>{
  let timestamp = Date.now();
  time = Math.floor(timestamp/1000);
  const random_no = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
  const form_name = `form_${random_no}_${time}`;
  req.body.answers.map((val, index)=>{
    val.form_id = form_name;
  })
  QuestionForm.insertMany(req.body.answers)
    .then(function(docs) {
      res.send({data:{success: true},message:"Question Submitted Successfully"});

    })
    .catch(function(err) {
      res.send({data:{success:false},message:"Failed to Submit Question"});
    });
}