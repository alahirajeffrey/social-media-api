import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const server: Express = express();

server.get("/", (req: Request, res: Response) => {
  return res.json({ message: "welcome to the homepage" });
});

export default server;
