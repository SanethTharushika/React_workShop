import express from 'express';
import {createUser } from '../controllers/userController.js';
import { loginUser } from '../controllers/userController.js';
import { getUser } from '../controllers/userController.js';
import { updateProfile } from '../controllers/userController.js';
import { updatePassword } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", getUser);
userRouter.put("/", updateProfile);
userRouter.post("/password" , updatePassword);

export default userRouter;