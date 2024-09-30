
import { Entity, ObjectIdColumn, Column } from "typeorm";
import { ObjectId } from "mongodb";

@Entity()
export class Token {
  @ObjectIdColumn()
  _id?: ObjectId;

  @Column()
  userId?: string;

  @Column()
  token?: string;

  @Column()
  createdAt?: Date;
}