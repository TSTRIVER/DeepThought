import express from "express";
const eventRouter = express.Router();
import { getEventInfoByID,insertEvent,deleteEvent,updateEvent } from "../controllers/eventControllers.js";

eventRouter.get("/events",getEventInfoByID);
eventRouter.post("/events",insertEvent);
eventRouter.delete("/events",deleteEvent);
eventRouter.put("/events",updateEvent);

export default eventRouter;