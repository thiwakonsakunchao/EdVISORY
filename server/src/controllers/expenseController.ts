import { Request, Response } from "express";
import { AppDataSource } from "../config/configDB"; 
import { Transaction } from "../entities/transaction";

export const getExpenseSummary = async (req: Request, res: Response): Promise<void> => {

    if (!req.session.userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
  
    try {
      const transactions = await AppDataSource.getRepository(Transaction).find({
        where: { userId: req.session.userId as string }, 
      });
  
      if (transactions.length === 0) {
        res.status(404).json({ message: "No transactions found for this user." });
        return;
      }
  
      const startDate = new Date(Math.min(...transactions.map(t => new Date(t.transaction_date).getTime())));
      const endDate = new Date(Math.max(...transactions.map(t => new Date(t.transaction_date).getTime())));
  

      const summaryType = req.query.summaryType;

      if (!summaryType || typeof summaryType !== 'string' || summaryType.trim() === "") {
        res.status(400).json({ message: "summaryType is required." });
        return;
      }

      const validSummaryTypes = ['daily', 'monthly', 'yearly'];
      if (!validSummaryTypes.includes(summaryType)) {
        res.status(400).json({ message: "Invalid summaryType. Valid values are daily, monthly, or yearly." });
        return;
      }

      const summary: Record<string, number> = {};
  
      transactions.forEach(transaction => {
        const date = new Date(transaction.transaction_date);
        const key = summaryType === 'monthly' ? `${date.getFullYear()}-${date.getMonth() + 1}` : 
                  summaryType === 'yearly' ? `${date.getFullYear()}` : 
                  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  
        if (!summary[key]) {
          summary[key] = 0;
        }
        summary[key] += transaction.amount;
      });
  
      res.status(200).json({
        startDate,
        endDate,
        summary,
      });
    } catch (error) {
      console.error("Error fetching expense summary:", error);
      res.status(500).json({ message: "Error fetching expense summary", error });
    }
  };
  