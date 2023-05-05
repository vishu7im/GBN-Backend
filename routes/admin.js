import {
  Adminlogin,
  getUser,
  UserResponse,
  fetchhomeuser,
  fetch,
  getoneuser,
  NewAdmin,
  uploadDocument,
} from "../controllers/admin.js";
import { Router } from "express";
import { AdminAuth } from "../middleware/admin.js";

const router = Router();

router.post("/", Adminlogin);
router.post("/new", AdminAuth, NewAdmin);
router.get("/user", AdminAuth, getUser);
router.get("/fetchhomeuser", fetchhomeuser);
router.get("/fetch", fetch);
router.get("/getuser/:id", getoneuser);
router.post("/response", AdminAuth, UserResponse);
router.post("/uploadDocument", AdminAuth, uploadDocument);

export default router;
