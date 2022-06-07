const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const bookSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  publishedDate: {
    type: String,
  },
  genres: {
    type: [String],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
  img: {
    type: String,
  },
});
bookSchema.index({ name: "text" });
const Book = mongoose.model("Book", bookSchema);
Book.createIndexes({ title: "text" });
module.exports = { Book };
