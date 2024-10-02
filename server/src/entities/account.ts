import { Entity, ObjectIdColumn, Column } from "typeorm";
import { ObjectId } from "mongodb";

@Entity()
export class Account {
  @ObjectIdColumn()
  _id?: ObjectId;

  @Column()
  userId: string; 

  @Column()
  account_name: string;

  @Column()
  initial_balance: number;

  constructor(userId: string, account_name: string, initial_balance: number) {
    this.userId = userId;
    this.account_name = account_name;
    this.initial_balance = initial_balance;
  }
}
