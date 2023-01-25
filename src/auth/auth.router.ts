import { Router } from "express";
<<<<<<< HEAD
=======
import { verifyToken } from "../utils/verifyToken";
>>>>>>> d1969681e71731d8915b198a1d281346505b5799
import * as auth from "./auth.controller";

const authRouter = Router();

authRouter.post("/register", auth.registerUser);

authRouter.post("/login", auth.loginUser);

authRouter.patch("/change-password", auth.changePassword);

authRouter.patch("/forgot-password", auth.forgotPassword);

authRouter.post("/send-verification-mail", auth.sendVerificationMail);

authRouter.post("/verify-email", auth.verifyEmail);
<<<<<<< HEAD
=======

authRouter.post("/logout", auth.logoutUser);
>>>>>>> d1969681e71731d8915b198a1d281346505b5799

export default authRouter;
