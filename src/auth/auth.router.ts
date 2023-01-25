import { Router } from "express";
import { verifyToken } from "../utils/verifyToken";
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

authRouter.patch("/auth/change-password", verifyToken, changePassword);

authRouter.patch("/auth/forgot-password", forgotPassword);

authRouter.post(
  "/auth/send-verification-mail",
  verifyToken,
  sendVerificationMail
);

authRouter.post("/auth/verify-email", verifyToken, verifyEmail);

export default authRouter;
