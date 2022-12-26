import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const server: Express = express();

server.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "welcome to the homepage" });
});

export default server;
