const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "./public/uploads/" });
const controller = require("../controllers/bookController");
const router = express.Router();
router.post("/", upload.single("img"), controller.addBook);
router.get("/", controller.getbook);
router.get("/search", controller.searchBook);
router.get("/:id", controller.getABook);

router.put("/:id", controller.updateBook);
router.delete("/:id", controller.deleteBook);

module.exports = router;
