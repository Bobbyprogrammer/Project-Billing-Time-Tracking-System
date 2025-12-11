import express from "express";
import {
  createProject,
  updateProject,
  getProjects,
  getProjectById,
  archiveProject,
  getBillingSummary,
} from "../controllers/project.controller.js";
import protect from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";

const router = express.Router();

router.post("/create", protect, admin, createProject);
router.put("/update/:id", protect, admin, updateProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.delete("/:id", protect, admin, archiveProject);

router.get("/:projectId/billing-summary", protect, getBillingSummary);

export default router;
