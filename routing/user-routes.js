const express = require('express');
const Router = express.Router;
const userControllers = require('../controllers/user-controllers');
const getAllUsers = userControllers.getAllUsers;
const signup = userControllers.signup;
const login = userControllers.login;
const deleteUser = userControllers.deleteUser;
const getUserById = userControllers.getUserById;


// validation is to be put in here

const userRouter=Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.delete("/:id",deleteUser);

module.exports = userRouter;
