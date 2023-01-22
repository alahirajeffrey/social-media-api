import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  loginUser,
  registerUser,
  sendVerificationMail,
  verifyEmail,
} from "./auth.controller";

const authRouter = Router();

authRouter.post("/auth/register", registerUser);

authRouter.post("/auth/login", loginUser);

authRouter.patch("/auth/change-password", changePassword);

authRouter.patch("/auth/forgot-password", forgotPassword);

authRouter.post("/auth/send-verification-mail", sendVerificationMail);

authRouter.post("/auth/verify-email", verifyEmail);

export default authRouter;
