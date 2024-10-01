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

      const existingCategoryName = await AppDataSource.getRepository(Category).findOneBy({ category_name });
      if (existingCategoryName) {
        res.status(400).json({ message: "Category Name already exists" });
        return 
      }

    try {
        const category = new Category(req.session.userId,category_name);
        await AppDataSource.getRepository(Category).save(category);
        res.status(201).json({ message: "Category created successfully", category });
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

  export const getAllCategory = async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 10 } = req.query;
  
    if (!req.session.userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
  
    try {
      const filters: any = { userId: req.session.userId };
  
      const numberLimit = parseInt(limit as string) || 10; 
      const numberPage = parseInt(page as string) || 1; 
      const skip = (numberPage - 1) * numberLimit; 
  
      const categorys = await AppDataSource.getMongoRepository(Category).find({
        where: filters,
        skip: skip,
        take: numberLimit
      });
    
      res.status(200).json({
        categorys,
  
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ message: "Error fetching transactions", error });
    }
  };