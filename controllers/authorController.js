const { Author } = require("../models/author");
const { Book } = require("../models/book");

const authorController = {
  addAuthor: async (req, res) => {
    const name = req.body.name;
    const author = await Author.findOne({ name: name });
    try {
      if (!author) {
        const newAuthor = new Author(req.body);
        const saveAuthor = await newAuthor.save();
        res.status(200).json(saveAuthor);
      }
      res.status(500).json("duplicate author");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getAllAuthors: async (req, res) => {
    try {
      const author = await Author.find().populate("books");
      res.status(200).json(author);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAnAuthor: async (req, res) => {
    try {
      const author = await Author.findById(req.params.id).populate("books");
      res.status(200).json(author);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateAuthor: async (req, res) => {
    try {
      const author = await Author.findById(req.params.id);
      await author.updateOne({ $set: req.body });
      res.status(200).json("updated");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteAuthor: async (req, res) => {
    try {
      await Book.updateMany(
        { author: req.params.id },
        {
          $pull: { author: req.params.id },
        }
      );
      await Author.findByIdAndDelete(req.params.id);
      res.status(200).json("delete success");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = authorController;
