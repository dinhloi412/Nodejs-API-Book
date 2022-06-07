const { Author } = require("../models/author");
const { Book } = require("../models/book");
const path = require("path");
const bookController = {
  addBook: async (req, res) => {
    try {
      const { name, publishedDate, genres, author } = req.body;

      if (!req.file) {
        return res.status(404).json("Please upload your image");
      }

      const newBook = new Book(req.body);
      const saveBook = await newBook.save({
        name,
        publishedDate,
        genres,
        author,
        img: req.file.path.split("/").slice(1).join("/"),
      });
      if (req.body.author) {
        const author = Author.findById(req.body.author);
        await author.updateOne({ $push: { books: saveBook._id } });
      }
      res.status(200).json(saveBook);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getbook: async (req, res) => {
    try {
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 10;
      const skip = limit * (page - 1);
      const sort = req.query.sort || "-createdAt";
      const getBook = await Book.find()
        .populate("author")
        .limit(limit)
        .skip(skip)
        .sort(sort);

      res.status(200).json(getBook);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getABook: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id).populate("author");
      res.status(200).json(book);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateBook: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      await book.updateOne({ $set: req.body });
      res.status(200).json("updated");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteBook: async (req, res) => {
    try {
      await Author.updateMany(
        { books: req.params.id },
        { $pull: { book: req.params.id } }
      );
      await Book.findByIdAndDelete(req.params.id);
      res.status(200).json("Deleted successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  searchBook: async (req, res) => {
    try {
      const search = req.query.name;
      const book = await Book.find();
      const data = await book.filter((item) => {
        return (
          item.name.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) !==
          -1
        );
      });

      res.status(200).json({ data });
      console.log(data);
    } catch (error) {
      res.status(500).json("fail");
    }
  },
};

module.exports = bookController;
