import { Entity, ObjectIdColumn, Column, ObjectId, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  name!: string;

  @Column()
  email!: string;
}
