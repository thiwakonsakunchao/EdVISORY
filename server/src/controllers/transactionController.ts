import { Request, Response } from "express";
import { AppDataSource } from "../config/configDB"; 
import { Transaction } from "../entities/transaction";
import { ObjectId } from "mongodb";


export const addTransaction = async (req: Request, res: Response): Promise<void> => {
  const { accountId, categoryId, amount, slipUrl, description } = req.body;

  if (!req.session.userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  if (!accountId || !categoryId || !amount) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const transaction_date = new Date(); 
    transaction_date.setHours(transaction_date.getHours() + 7);

    const transaction = new Transaction(
      req.session.userId,
      accountId,
      categoryId,
      amount,
      transaction_date, 
      slipUrl || "",
      description || ""
    );

    await AppDataSource.getRepository(Transaction).save(transaction);
    res.status(201).json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    res.status(500).json({ message: "Error creating transaction", error });
  }
};




export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
  
    if (!req.session.userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
  
    try {
      const result = await AppDataSource.getRepository(Transaction).delete({
        _id: new ObjectId(id),
        userId: req.session.userId,
      });
  
      if (result.affected === 0) {
        res.status(404).json({ message: "Transaction not found" });
      } else {
        res.status(204).send();
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting transaction", error });
    }
  };