const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URL, { useNewUrlParser: true })
      .then(console.log("success"));
  } catch (error) {
    console.log(error);
  }
};

module.exports = connect;
