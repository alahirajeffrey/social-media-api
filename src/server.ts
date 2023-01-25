import express, { Express, Request, Response } from "express";
import authRouter from "./auth/auth.router";
import profileRouter from "./profile/profile.router";

const server: Express = express();

server.use(express.json());
server.use("/api/v1/auth", authRouter);
server.use("/api/v1/profile", profileRouter);

server.get("/api/v1/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "welcome to the homepage" });
});

export default server;
