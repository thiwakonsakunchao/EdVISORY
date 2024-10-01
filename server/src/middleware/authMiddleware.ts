import { Request, Response, NextFunction } from "express";


export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session.userId) {
    res.status(401).json({ message: "Not authenticated" });
    return; 
  }
  next(); 
};
