module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        question: String,
        is_required: String,
        question_type: Number,
        sequence: Number,
        status: Boolean      
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