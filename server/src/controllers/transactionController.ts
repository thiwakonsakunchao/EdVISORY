import { Request, Response } from "express";
import { AppDataSource } from "../config/configDB"; 
import { Transaction } from "../entities/transaction";
import { ObjectId } from "mongodb";
import bucket from "../config/configFirebase";

const badWords = [
  "สัส",
  "ห่า",
  "เหี้ย",
  "กู",
  "โง่",
  "ไอ่",
  "แม่ง",
  "อีนี่",
  "มึง",
];


function replaceBadWords(text: string, badWords: string[], replacement: string = "***"): string {
  const badWordsPattern = new RegExp(badWords.join("|"), "gi");
  return text.replace(badWordsPattern, replacement);
}


export const addTransaction = async (req: Request, res: Response): Promise<void> => {
  const { accountId, categoryId, amount, description } = req.body;

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

    let slipUrl = "";
    if (req.file) {
      const fileName = `transactions/${req.file.originalname}`;
      const file = bucket.file(fileName);
      await file.save(req.file.buffer, {
        metadata: {
          contentType: req.file.mimetype,
        },
      });
      await file.makePublic();
      slipUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    const text = description;
    const cleanText = replaceBadWords(text, badWords);

    const transaction = new Transaction(
      req.session.userId,
      accountId,
      categoryId,
      amount,
      transaction_date, 
      [],
      cleanText
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



  export const getAllTransactions = async (req: Request, res: Response): Promise<void> => {
    const { month, year, categoryId, accountId } = req.query;
  
    if (!req.session.userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
  
    try {
      const filters: any = { userId: req.session.userId };
  
      if (month || year) {
        const startDate = new Date();
        const endDate = new Date();
  
        if (year) {
          startDate.setFullYear(parseInt(year as string), month ? parseInt(month as string) - 1 : 0, 1);
          endDate.setFullYear(parseInt(year as string), month ? parseInt(month as string) : 12, 0);
        } else if (month) {
          startDate.setMonth(parseInt(month as string) - 1, 1);
          endDate.setMonth(parseInt(month as string), 0);
        }
  
        filters.transaction_date = {
          $gte: startDate,
          $lte: endDate
        };
      }
  
      if (categoryId) {
        filters.categoryId = categoryId;
      }

      if (accountId) {
        filters.accountId = accountId;
      }

      const transactions = await AppDataSource.getMongoRepository(Transaction).find({
        where: filters
      });
      
      res.status(200).json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ message: "Error fetching transactions", error });
    }
  };
  

  export const addSlipToTransaction = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!req.session.userId) {
        res.status(401).json({ message: "User not authenticated" });
        return;
    }

    if (!req.file) {
        res.status(400).json({ message: "Slip image is required" });
        return;
    }

    try {
        const fileName = `transactions/${req.file.originalname}`;
        const file = bucket.file(fileName);

        await file.save(req.file.buffer, {
            metadata: {
                contentType: req.file.mimetype,
            },
        });

        await file.makePublic();

        const slipUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        const transaction = await AppDataSource.getRepository(Transaction).findOne({
            where: {
                _id: new ObjectId(id)
            }
        });

        if (!transaction) {
            res.status(404).json({ message: "Transaction not found" });
            return;
        }

        if (!transaction.slipUrl) {
            transaction.slipUrl = []; 
        }

        if (!Array.isArray(transaction.slipUrl)) {
            transaction.slipUrl = []; 
}

        transaction.slipUrl.push(slipUrl);

        await AppDataSource.getRepository(Transaction).save(transaction);

        res.status(200).json({ message: "Slip image added successfully", transaction });
        
    } catch (error) {
        console.error('Error in addSlipToTransaction:', error);
        res.status(500).json({ message: "Error updating transaction", error: error }); 
    }
};

export const removeSlipFromTransaction = async (req: Request, res: Response): Promise<void> => {
  
  const { id } = req.params; 
  const { slipUrl } = req.body; 

  if (!req.session.userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
  }

  try {
      const transaction = await AppDataSource.getRepository(Transaction).findOne({
          where: {
              _id: new ObjectId(id)
          }
      });
      if (!transaction) {
          res.status(404).json({ message: "Transaction not found" });
          return;
      }

      if (!transaction.slipUrl || !Array.isArray(transaction.slipUrl)) {
          res.status(400).json({ message: "No slip URLs found in transaction" });
          return;
      }

      if (!transaction.slipUrl.includes(slipUrl)) {
          res.status(400).json({ message: "Slip URL not found in transaction" });
          return;
      }

      transaction.slipUrl = transaction.slipUrl.filter(url => url !== slipUrl);

      const filePath = slipUrl.split('/').pop(); 

      await bucket.file(`transactions/${filePath}`).delete();

      await AppDataSource.getRepository(Transaction).save(transaction);

      res.status(200).json({ message: "Slip removed successfully", slipUrl: transaction.slipUrl });
  } catch (error) {
      console.error("Error removing slip from transaction:", error);
      res.status(500).json({ message: "Error removing slip from transaction", error });
  }
};

export const updateDescription = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { description } = req.body;

  const text = description;
  const cleanText = replaceBadWords(text, badWords);

  if (!req.session.userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  try {
    const transaction = await AppDataSource.getRepository(Transaction).findOne({
      where: { _id: new ObjectId(id) }
    });

    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    transaction.description = cleanText;

    await AppDataSource.getRepository(Transaction).save(transaction);

    res.status(200).json({ message: "Description updated successfully", transaction });
  } catch (error) {
    res.status(500).json({ message: "Error updating description", error });
  }
};

