const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

//add and remove favorites
router.put("/favorites", userController.addOrRemoveFavorite);


module.exports = router;