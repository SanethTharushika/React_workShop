import express from 'express';
import {createUser } from '../controllers/userController.js';
import { loginUser } from '../controllers/userController.js';
import { getUser } from '../controllers/userController.js';
import { updateProfile } from '../controllers/userController.js';
import { updatePassword } from '../controllers/userController.js';
import { googleLogin } from '../controllers/userController.js';
import { sendOTP } from '../controllers/userController.js';
import { verifyOTP } from '../controllers/userController.js';
import { getAllUsers } from '../controllers/userController.js';
import { updateUserState } from '../controllers/userController.js';
import { switchRole } from '../controllers/userController.js';
import { logoutUser } from '../controllers/userController.js';
import { validate } from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../validation/userSchemas.js";


const userRouter = express.Router();

userRouter.post("/", validate(registerSchema), createUser);
userRouter.post("/login", validate(loginSchema), loginUser);
userRouter.get("/me", getUser);
userRouter.get("/all/:pageNumber/:pageSize", getAllUsers);
userRouter.put("/", updateProfile);
userRouter.post("/password" , updatePassword);
userRouter.post("/google-login", googleLogin);
userRouter.post("/otp", sendOTP);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/logout", logoutUser);

userRouter.put("/state/:email", updateUserState);
userRouter.put("/role/:email", switchRole);

export default userRouter;