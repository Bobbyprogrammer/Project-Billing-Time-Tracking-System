import express from "express";
import {
  getUserProfile,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/user.controller.js";
import protect from "../middlewares/auth.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getUserProfile);
router.put("/update", protect, updateProfile);
router.get("/logout", protect, logout);

export default router;
