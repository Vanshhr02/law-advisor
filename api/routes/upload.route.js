import express from "express";
import { analyzeText } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/analyze-legal", analyzeText);

export default router;
