const express = require("express");

const router = express.Router();
const controller = require("../controllers/userController");
const auth = require("../middleware/auth");
router.post("/create", controller.createUser);
router.post("/refresh", controller.requestRefreshToken);
router.post("/login", controller.login);
router.get("/", auth.verifyToken, controller.getUsers);
router.delete(
  "/:id",
  auth.verifyTokenAndUserAuthorization,
  controller.deleteUser
);
// refreshToken

module.exports = router;
