import { Router } from "express";
import {
  login,
  signup,
  otpsent,
  validate,
  exist,
} from "../controllers/Auth.js";
import { OAuth } from "../middleware/admin.js";

const router = Router();

router.post("/signup", OAuth, signup);
router.post("/login", login);
router.post("/exist", exist);

router.post("/otpsent", otpsent);
router.post("/validate", validate);

export default router;
