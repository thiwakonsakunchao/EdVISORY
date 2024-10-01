import { Entity, ObjectIdColumn, Column } from "typeorm";
import { ObjectId } from "mongodb"; 

@Entity()
export class User {
  @ObjectIdColumn()
  _id?: ObjectId;

  @Column()
  username: string;

  @Column()
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}