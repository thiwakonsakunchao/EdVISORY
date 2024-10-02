import { Router } from "express";
import { addAccount, deleteAccount, getAllAccount } from "../controllers/accountController";
import { authenticate } from "../middleware/authMiddleware";
import { calculateAvailableBudget } from "../controllers/calculateController";

const router = Router();

router.get("/", authenticate, calculateAvailableBudget)



export default router;
