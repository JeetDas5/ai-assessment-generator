import { Router } from "express";
import { upload } from "../middleware/upload.middleware";
import { createAssignment, getAssignments } from "../controllers/assignment.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getAssignments);

router.post(
  "/create",
  authMiddleware,
  upload.single("file"),
  createAssignment
);

export default router;