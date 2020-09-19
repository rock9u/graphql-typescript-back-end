import * as bcrypt from 'bcryptjs'
import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql'
import { User } from '../../entity/User'
import { isAuth } from '../middleware/isAuth'
import { logger } from '../middleware/logger'
import { createConfirmationUrl } from '../utils/createConfirmationUrl'
import { sendEmail } from '../utils/sendEmail'
import { RegisterInput } from './register/RegisterInput'

@Resolver(User)
export class UserResolver {
  @UseMiddleware(isAuth, logger)
  @Query(() => String)
  async hello() {
    return 'hello world'
  }

  @FieldResolver()
  async name(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`
  }

  @Mutation(() => User)
  async register(
    @Arg('data') { firstName, lastName, email, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save()

    await sendEmail(email, await createConfirmationUrl(user.id))
    return user
  }
}
