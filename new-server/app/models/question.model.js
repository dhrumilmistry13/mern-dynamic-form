module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        question: {type: String, default: ''},
        is_required: {type: Boolean, default: false},
        question_type: {type: Number, default: 1},
        question_options: {type: Array, default: []},
        sequence: {type: Number, default: 0} ,
        status:  {type: Boolean, default: true}      
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Question = mongoose.model("question", schema);
    return Question;
  };