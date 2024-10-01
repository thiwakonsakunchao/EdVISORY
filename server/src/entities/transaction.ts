import { Entity, ObjectIdColumn, Column } from "typeorm";
import { ObjectId } from "mongodb";

@Entity()
export class Transaction {
  @ObjectIdColumn()
  _id?: ObjectId;

  @Column()
  userId: string; 

  @Column()
  accountId: string; 

  @Column()
  categoryId: string;

  @Column()
  amount: number;

  @Column()
  transaction_date: Date;

  @Column("simple-array")
  slipUrl: string[]; 

  @Column()
  description: string;

  constructor(userId: string, accountId: string, categoryId: string, amount: number, transaction_date: Date, slipUrl: string[], description: string) {
    this.userId = userId;
    this.accountId = accountId;
    this.categoryId = categoryId;
    this.amount = amount;
    this.transaction_date = transaction_date;
    this.slipUrl = slipUrl;
    this.description = description;
  }
}
