const db = require("../models");
const QuestionForm = db.questionForm;

// Retrieve all Question from the database.
exports.findAll = async (req, res) => {
    let { page, serach_text } = req.query;
    var condition = serach_text ? { question: { $regex: new RegExp(serach_text), $options: "i", }, } : {};
    if (!page) {
        page = 1;
    }
    const q = await QuestionForm.aggregate([{
        $group:
          {
            _id: "$form_id",
          },
      }
    ]);
    const count = q.length;
    // let count = await q.count();
    let last_page = count / 10;
    last_page = last_page % 10 === 0 ? Math.round(last_page) : Math.round(last_page) + 1;
    QuestionForm.aggregate([{
          $group:
            {
              _id: "$form_id",
            }
        }
      ]).skip((page - 1) * 10).limit(10).then(data => {
            res.send({
                data: {
                    question_list: data,
                    pagination: {
                        "last_page": last_page
                    }
                },
                message: "get list done"
            });
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

    QuestionForm.find({form_id : id})
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found question with id " + id });
            else {
                res.send({ data: data, message: 'Question data fetch' });
            }
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving question with id=" + id });
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

exports.saveQuestionData = async (req, res) => {
    let form_name = req.body.form_id;
    if (!form_name) {
        let timestamp = Date.now();
        time = Math.floor(timestamp / 1000);
        const random_no = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
        form_name = `form_${random_no}_${time}`;
    }
    req.body.answers.map((val, index) => {
        val.form_id = form_name;
    })
    QuestionForm.insertMany(req.body.answers)
        .then(function (docs) {
            res.send({ data: { success: true }, message: "Question Submitted Successfully" });

        })
        .catch(function (err) {
            res.send({ data: { success: false }, message: "Failed to Submit Question" });
        });
}