import express from "express";

import cors from "cors";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";

import Router from "./routes/chat.routes";

import { ErrorHandler } from "@envy-core/common";

const app = express();

configDotenv();

app.use(cookieParser())

app.use(
  cors({
    origin: "https://educore.live",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json("helloooo from chat");
});

app.use(express.json());
app.use(express.urlencoded({extended: true }));

app.use('/api/chat', Router)

app.use(ErrorHandler.handleError);

export default app;
