import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
@Entity()
export class Project extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  url: string
}
