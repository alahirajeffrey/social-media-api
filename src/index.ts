import express, { Express } from "express";
import dotenv from "dotenv";

dotenv.config();

const port: number = Number(process.env.PORT) || 5000;

const app: Express = express();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
