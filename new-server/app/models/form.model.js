module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        form_id: {type: Number, default:1}
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const QuestionForm = mongoose.model("QuestionForm", schema);
    return QuestionForm;
  };