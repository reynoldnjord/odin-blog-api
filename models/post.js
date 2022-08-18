const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  text: { type: String, required: true },
  author_name: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  published: { type: Boolean, default: false },
});

PostSchema.virtual("date_formated").get(function () {
  return this.date.toLocaleDateString("en-gb", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
});

module.exports = mongoose.model("Post", PostSchema);
