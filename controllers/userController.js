const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userController = {
  createUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      if (!username || !email || !password) {
        return res.status(500).json({ msg: "Please fill in all fields. " });
      }
      if (!validateEmail(email)) {
        return res.status(500).json({ msg: "Invalid" });
      }
      const user = await User.findOne({ username: req.body.username });
      if (user) {
        return res.status(500).json({ msg: "username already exit" });
      }
      if (password.length < 6) {
        return res
          .status(500)
          .json({ msg: "Password must be at least 6 Characters." });
      }
      if (!user) {
        const newUser = new User({
          username,
          email,
          password: hashPassword,
        });
        await newUser.save();
        res.status(200).json(newUser);
      } else {
        return res.status(500).json("duplicate users");
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  generateAccessToken: (user) => {
    return jwt.sign(
      { username: user.username, admin: user.admin },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30d" }
    );
  },
  refreshToken: (user) => {
    return jwt.sign(
      { username: user.username, admin: user.admin },
      process.env.JWT_REFERSH_TOKEN,
      { expiresIn: "365d" }
    );
  },
  login: async (req, res) => {
    try {
      const { username } = req.body;
      const user = await User.findOne({ username: username });
      if (!user) {
        return res.status(500).json({ msg: "username is not exit" });
      }
      const comparePassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!comparePassword) {
        return res.status(500).json({ msg: "password is incorrect" });
      }

      //
      if (user && comparePassword) {
        const accessToken = userController.generateAccessToken(user);
        const reFreshToken = userController.refreshToken(user);
        //
        res.cookie("refreshToken", reFreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });

        const { password, ...others } = user._doc;
        return res.json({ accessToken, ...others });
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUsers: async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;
      await User.findByIdAndDelete({ _id: id });
      res.status(200).json("deleted");
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json("you are not auth");
    }
    jwt.verify(refreshToken, process.env.JWT_REFERSH_TOKEN, (err, user) => {
      if (err) {
        console.log(err);
      }
      const newAccessToken = userController.generateAccessToken(user);
      const newRefreshToken = userController.refreshToken(user);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  },
};
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
module.exports = userController;
