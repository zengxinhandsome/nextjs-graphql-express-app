import { Field, ObjectType } from "type-graphql";
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, BaseEntity } from "typeorm";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
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
  @Column({ type: "text" })
  title!: string;

}