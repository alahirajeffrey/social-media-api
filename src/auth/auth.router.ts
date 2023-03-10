import { Router } from "express";
import * as auth from "./auth.controller";

const authRouter = Router();

authRouter.post("/register", auth.registerUser);

authRouter.post("/login", auth.loginUser);

authRouter.patch("/change-password", auth.changePassword);

authRouter.patch("/forgot-password", auth.forgotPassword);

authRouter.post("/send-verification-mail", auth.sendVerificationMail);

authRouter.post("/verify-email", auth.verifyEmail);

export default authRouter;
