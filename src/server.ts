import express, { Express, Request, Response } from "express";
import authRouter from "./auth/auth.router";

const server: Express = express();

server.use(express.json());
server.use("/api/v1/", authRouter);

server.get("/api/v1/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "welcome to the homepage" });
});

export default server;
