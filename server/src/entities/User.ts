import { Field, ObjectType } from "type-graphql";
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, BaseEntity, OneToMany } from "typeorm";
import { Post } from "./Post";
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column({ type: "text", unique: true })
  email!: string;

  @Field()
  @Column({ type: "text", unique: true })
  username!: string;

  @OneToMany(() => Post, post => post.creator)
  posts!: Post[];

  @Column({ type: "text" })
  password!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}