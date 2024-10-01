import { Request, Response } from "express";
import { AppDataSource } from "../config/configDB";
import bcrypt from "bcryptjs";
import { User } from "../entities/user";
import { ObjectId } from "mongodb";


export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;


  const existingUser = await AppDataSource.getRepository(User).findOneBy({ username });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }


  const hashedPassword = await bcrypt.hash(password, 10);


  const user = AppDataSource.getRepository(User).create({ username, password: hashedPassword });
  await AppDataSource.getRepository(User).save(user);

  return res.status(201).json({ message: "User registered successfully" });
};


export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;


  const user = await AppDataSource.getRepository(User).findOneBy({ username });
  if (!user) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  req.session.userId = user._id?.toString(); 

  return res.status(200).json({ message: "Logged in successfully" });
};




export const status = async (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

 
  const user = await AppDataSource.getRepository(User).findOneBy({ _id: new ObjectId(req.session.userId) });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ message: "Authenticated", user });
};


export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
};









