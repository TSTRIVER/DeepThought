import express from "express";
import bodyParser from "body-parser";
import eventRouter from "./routes/eventRoutes.js";

export const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use("/api/v3/app",eventRouter);