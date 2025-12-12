import express from "express";
import {
  createTimeLog,
  updateTimeLog,
  deleteTimeLog,
  getTimeLogsByProject,
  updateLogStatus,
} from "../controllers/timelog.controller.js";
import protect from "../middlewares/auth.js";

const router = express.Router();

router.post("/projects/:projectId/logs", protect, createTimeLog);
router.put("/logs/:id", protect, updateTimeLog);
router.delete("/logs/:logId", protect, deleteTimeLog);
router.get("/projects/:projectId/logs", protect, getTimeLogsByProject);
router.patch("/logs/:id/status", protect, updateLogStatus);

export default router;
