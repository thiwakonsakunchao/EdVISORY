import { Router } from "express";
import { exportTransactionData, importTransactionData } from "../controllers/portController"; 
import { authenticate } from "../middleware/authMiddleware"; 
import { importFile } from "../middleware/ImportMiddleware";

const router = Router();

router.get("/export", authenticate, exportTransactionData);
router.post("/import", authenticate, importFile, importTransactionData);


export default router;
