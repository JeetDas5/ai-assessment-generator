import { Router } from "express";
import { signup, signin, updateSchoolInfo } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.put("/school", authMiddleware as any, updateSchoolInfo as any);

export default router;
