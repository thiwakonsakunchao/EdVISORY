import { Request, Response } from "express";
import { AppDataSource } from "../config/configDB"; 
import { Account } from "../entities/account"; 
import { Transaction } from "../entities/transaction"; 
import { ObjectId } from "mongodb";

export const calculateAvailableBudget = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId; 
    const { accountId } = req.body;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (!ObjectId.isValid(accountId)) {
      res.status(400).json({ message: "Invalid account ID" });
      return;
    }

    const account = await AppDataSource.getRepository(Account).findOneBy({ _id: new ObjectId(accountId), userId });
    
    if (!account) {
      res.status(404).json({ message: "Account not found or does not belong to the user" });
      return;
    }
    console.log(account);
    

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 7);

    const year = currentDate.getFullYear();

    const startOfMonth = new Date(year, currentDate.getMonth(), 2);
    const endOfMonth = new Date(year, currentDate.getMonth() + 1, 1);

    const startOfMonthString = startOfMonth.toISOString().split('T')[0]; 
    const endOfMonthString = endOfMonth.toISOString().split('T')[0];

    const filters: any = { userId: req.session.userId };

    filters.transaction_date = {
        $gte: new Date(startOfMonthString),
        $lte: new Date(endOfMonthString)
      };

    filters.accountId = accountId;

    const transactions = await AppDataSource.getMongoRepository(Transaction).find({
        where: filters
      });
    
    const totalExpenses = transactions.reduce((total, transaction) => total + transaction.amount, 0);
    
    const remainingBalance = account.initial_balance - totalExpenses;

    const remainingDays = Math.ceil((endOfMonth.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

    const dailyBudget = remainingDays > 0 ? remainingBalance / remainingDays : 0;

    const initialBalance = account.initial_balance;;
    
    res.status(200).json({
      initialBalance,
      totalExpenses,
      remainingBalance,
      dailyBudget,
      remainingDays,
    });
  } catch (error) {
    console.error("Error calculating budget:", error);
    res.status(500).json({ message: "Error calculating budget", error });
  }
};
