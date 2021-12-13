import { Field, ObjectType } from "type-graphql";
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, BaseEntity } from "typeorm";
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;

  @Field()
  @Column({ type: "text", unique: true })
  email!: string;

  @Field()
  @Column({ type: "text", unique: true })
  username!: string;

  @Column({ type: "text" })
  password!: string;
}