import { Request, Response } from "express";
import { AppDataSource } from "../config/configDB"; 
import { Account } from "../entities/account";
import { ObjectId } from "mongodb";

export const addAccount = async (req: Request, res: Response): Promise<void> => {
    const { account_name, initail_balance } = req.body;
  
    if (!req.session.userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
  
    if (!account_name || typeof account_name !== 'string' || account_name.trim() === "") {
      res.status(400).json({ message: "Account account_name is required." });
      return;
    }
  
    try {
      const account = new Account(req.session.userId, account_name, initail_balance);
      await AppDataSource.getRepository(Account).save(account);
      res.status(201).json({ message: "Account created successfully", account });
    } catch (error) {
      res.status(500).json({ message: "Error creating account", error });
    }
  };


export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;


  if (!req.session.userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  try {
    const result = await AppDataSource.getRepository(Account).delete({ _id: new ObjectId(id), userId: req.session.userId });
    if (result.affected === 0) {
      res.status(404).json({ message: "Account not found" });
      return;
    }
    res.status(201).json({ message: "Delete Successful" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting account", error });
  }
};
