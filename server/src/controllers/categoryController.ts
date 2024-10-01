import { Request, Response } from "express";
import { AppDataSource } from "../config/configDB"; 
import { Category } from "../entities/category";
import { ObjectId } from "mongodb";

export const addCategory = async (req: Request, res: Response): Promise<void> => {
    const { category_name } = req.body;

    if (!req.session.userId) {
        res.status(401).json({ message: "User not authenticated" });
        return;
      }

    if (!category_name || typeof category_name !== 'string' || category_name.trim() === "") {
        res.status(400).json({ message: "Category Name is required." });
        return;
      }

    try {
        const categorty = new Category(category_name);
        await AppDataSource.getRepository(Category).save(categorty);
        res.status(201).json({ message: "Category created successfully", categorty });
      } catch (error) {
        res.status(500).json({ message: "Error creating account", error });
      }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
  

    if (!req.session.userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
  
    try {
      const result = await AppDataSource.getRepository(Category).delete({ _id: new ObjectId(id)});
      if (result.affected === 0) {
        res.status(404).json({ message: "Account not found" });
        return;
      }
      res.status(201).json({ message: "Delete Successful" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting account", error });
    }
  };