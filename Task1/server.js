import {app} from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config({path: "./config/config.env"});

const PORT = process.env.PORT;

connectDB();

app.listen(PORT,()=>{
    console.log(`Listening to the server at Port ${PORT}`)
})