import { Router } from "express";
import { exportData } from "../controllers/portController"; 

const router = Router();

router.get("/export", exportData);

export default router;
