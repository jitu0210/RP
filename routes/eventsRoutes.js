import express from "express";
import { getLiveEvents } from "../controllers/eventsController.js";

const router = express.Router();

// Single route to fetch live + error events
router.get("/", getLiveEvents);

export default router;