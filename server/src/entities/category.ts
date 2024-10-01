import { Entity, ObjectIdColumn, Column } from "typeorm";
import { ObjectId } from "mongodb";

@Entity()
export class Category {
  @ObjectIdColumn()
  _id?: ObjectId;

  @Column()
  category_name: string;


  constructor(category_name: string) {
    this.category_name = category_name;
  }
}
