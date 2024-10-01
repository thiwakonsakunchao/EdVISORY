import { Request, Response } from "express";
import * as XLSX from "xlsx";
import stream from "stream";
import csv from "csv-parser";
import { AppDataSource } from "../config/configDB";
import { Transaction } from "../entities/transaction";
import fs from "fs";
import path from "path"; 

export const exportTransactionData = async (req: Request, res: Response): Promise<void> => {
  if (!req.session.userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  try {

    const transactions = await AppDataSource.getRepository(Transaction).find({
      where: { userId: req.session.userId },
    });

    if (transactions.length === 0) {
      res.status(404).json({ message: "No transactions found for this user." });
      return;
    }

    const outputDir = path.join(__dirname, "../exports");

    const format = req.query.format as string || 'csv'; 

    if (format === 'csv') {

      const csvData = transactions.map(transaction => ({
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        amount: transaction.amount,
        transaction_date: transaction.transaction_date,
        slipUrl: transaction.slipUrl.length > 0 ? transaction.slipUrl.join(', ') : 'N/A', 
        description: transaction.description,
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(csvData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
      

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      const csvFilePath = path.join(outputDir, `transactions_${req.session.userId}_${Date.now()}.csv`);
      fs.writeFileSync(csvFilePath, XLSX.write(workbook, { type: 'buffer', bookType: 'csv' }));
      res.status(200).json({ message: "CSV file exported successfully.", filePath: csvFilePath });

    } else if (format === 'xlsx') {

      const xlsxData = transactions.map(transaction => ({
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        amount: transaction.amount,
        transaction_date: transaction.transaction_date,
        slipUrl: transaction.slipUrl.length > 0 ? transaction.slipUrl.join(', ') : 'N/A',
        description: transaction.description,
      }));
      const xlsxWorksheet = XLSX.utils.json_to_sheet(xlsxData);
      const xlsxWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(xlsxWorkbook, xlsxWorksheet, "Transactions");


      const xlsxFilePath = path.join(outputDir, `transactions_${req.session.userId}_${Date.now()}.xlsx`);
      fs.writeFileSync(xlsxFilePath, XLSX.write(xlsxWorkbook, { type: 'buffer', bookType: 'xlsx' }));
      res.status(200).json({ message: "Excel file exported successfully.", filePath: xlsxFilePath });

    } else if (format === 'json') {
      
      const jsonFilePath = path.join(outputDir, `transactions_${req.session.userId}_${Date.now()}.json`);
      fs.writeFileSync(jsonFilePath, JSON.stringify(transactions, null, 2));
      
      
      res.download(jsonFilePath, (err) => {
        if (err) {
          console.error("Error downloading JSON file:", err);
          res.status(500).json({ message: "Error downloading JSON file", error: err });
        }
      });
    }

  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).json({ message: "Error exporting data", error });
  }
};

export const importTransactionData = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const fileBuffer = req.file.buffer;
    const fileExt = req.file.originalname.split('.').pop()?.toLowerCase();
    let data: Transaction[] = []; 
  
    const userId = req.session.userId; 

  
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }


    if (fileExt === "csv") {
      const readableStream = new stream.Readable();
      readableStream.push(fileBuffer);
      readableStream.push(null);

      readableStream
        .pipe(csv())
        .on('data', (row: any) => {
          const transaction = new Transaction(
            userId, 
            null,
            null,
            parseFloat(row.amount),
            new Date(row.transaction_date),
            [], 
            row.description
          );
          data.push(transaction);
        })
        .on('end', async () => {
          await AppDataSource.getRepository(Transaction).save(data);
          res.status(200).json({ message: "Data imported successfully", data });
        });
    } else if (fileExt === "json") {
      data = JSON.parse(fileBuffer.toString()).map((row: any) => new Transaction(
        userId, 
        null,
        null,
        row.amount,
        new Date(row.transaction_date),
        [], 
        row.description
      ));

      await AppDataSource.getRepository(Transaction).save(data);
      res.status(200).json({ message: "Data imported successfully", data });
    } else {
      res.status(400).json({ message: "Unsupported file type" });
      return;
    }
  } catch (error) {
    console.error("Error importing data:", error);
    res.status(500).json({ message: "Error importing data", error });
  }
};
