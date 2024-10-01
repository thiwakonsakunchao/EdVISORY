import { Router } from "express";
import { getExpenseSummary } from "../controllers/expenseController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();


router.get("/summary", authenticate, getExpenseSummary);

export default router;
