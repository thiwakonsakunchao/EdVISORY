import { Entity, ObjectIdColumn, Column } from "typeorm";
import { ObjectId } from "mongodb";

@Entity()
export class Category {
  @ObjectIdColumn()
  _id?: ObjectId;

  @Column()
  userId: string; 

  @Column()
  category_name: string;


  constructor(userId: string, category_name: string) {
    this.userId = userId;
    this.category_name = category_name;
  }
}
