import express, { Express, Request, Response } from "express";
import authRouter from "./auth/auth.router";
import profileRouter from "./profile/profile.router";

const server: Express = express();

server.use(express.json());
server.use("/api/v1/auth", authRouter);
<<<<<<< HEAD
server.use("/api/v1/profile", profileRouter);
=======
>>>>>>> d1969681e71731d8915b198a1d281346505b5799

server.get("/api/v1/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "welcome to the homepage" });
});

export default server;
