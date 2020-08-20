import {
  Resolver,
  Mutation,
  Arg,
  Int,
  Query,
  InputType,
  Field,
} from 'type-graphql'
import { Project } from '../entity/Project'

@InputType()
class ProjectInput {
  @Field()
  url: string
}

@InputType()
class ProjectUpdateInput {
  @Field()
  url: string
}

@Resolver()
export class ProjectResolver {
  @Mutation(() => Project)
  async createProject(
    @Arg('options', () => ProjectInput) options: ProjectInput
  ) {
    const project = await Project.create(options).save()
    return project
  }

  @Mutation(() => Boolean)
  async updateProject(
    @Arg('id', () => Int) id: number,
    @Arg('input', () => ProjectUpdateInput) input: ProjectUpdateInput
  ) {
    await Project.update({ id }, input)
    return true
  }

  @Mutation(() => Boolean)
  async deleteProject(@Arg('id', () => Int) id: number) {
    await Project.delete({ id })
    return true
  }

  @Query(() => [Project])
  project() {
    return Project.find()
  }
}
