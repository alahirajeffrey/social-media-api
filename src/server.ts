import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import authRouter from "./auth/auth.router";

dotenv.config();

const server: Express = express();

server.use(express.json());
server.use("/api/v1/", authRouter);

server.get("/api/v1/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "welcome to the homepage" });
});

export default server;
