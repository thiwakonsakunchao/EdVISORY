import path from 'path';
import "dotenv/config";
import { DataSource } from 'typeorm';
import "reflect-metadata";

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: process.env.MONGO_URL,
  useNewUrlParser: true,  
  synchronize: true,
  useUnifiedTopology: true,
  entities: [path.join(__dirname, "../entities/*.ts")],
});


