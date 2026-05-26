import { Router } from "express";
import { upload } from "../middleware/upload.middleware";
import { createAssignment } from "../controllers/assignment.controller";

const router = Router();

router.post(
  "/create",
  upload.single("file"),
  createAssignment
);

export default router;