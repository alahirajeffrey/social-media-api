import { Router } from "express";
import { verifyToken } from "../utils/verifyToken";
import * as auth from "./auth.controller";

const authRouter = Router();

authRouter.post("/register", auth.registerUser);

authRouter.post("/login", auth.loginUser);

authRouter.patch("/change-password", verifyToken, auth.changePassword);

authRouter.patch("/forgot-password", auth.forgotPassword);

authRouter.post("/send-verification-mail", auth.sendVerificationMail);

authRouter.post("/verify-email", auth.verifyEmail);

authRouter.post("/logout", auth.logoutUser);

export default authRouter;
