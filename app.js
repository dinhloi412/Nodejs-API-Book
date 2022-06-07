const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

const connect = require("./config/dbConnect");
var cookieParser = require("cookie-parser");
const authorRouter = require("./routes/authorRouter");
const bookRouter = require("./routes/bookRouter");
const userRouter = require("./routes/userRouter");
const app = express();
dotenv.config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/static", express.static("public"));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("common"));
app.use(cookieParser());
connect();
const PORT = process.env.PORT || 5000;
app.use("/v1/author", authorRouter);
app.use("/v1/book", bookRouter);
app.use("/v1/user", userRouter);

app.listen(PORT, () => console.log(`server running at ${PORT}`));
