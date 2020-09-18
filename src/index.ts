import { ApolloServer } from 'apollo-server-express'
import connectRedis from 'connect-redis'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { createConnection } from 'typeorm'
import { ProjectResolver } from './modules/project/ProjectResolver'
import { LoginResolver } from './modules/user/Login'
import { MeResolver } from './modules/user/Me'
import { UserResolver } from './modules/user/Register'
import { redis } from './redis'
;(async () => {
  await createConnection()
  const schema = await buildSchema({
    resolvers: [ProjectResolver, UserResolver, LoginResolver, MeResolver],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId
    },
  })

  const apolloServer = new ApolloServer({
    playground: {
      settings: {
        'request.credentials': 'include',
      },
    },
    schema,
    context: ({ req }: any) => ({ req }),
  })

  const app = express()

  const RedisStore = connectRedis(session)
  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:3000',
    })
  )

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: 'qid',
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  )
  apolloServer.applyMiddleware({ app })

  app.listen(4000, () => {
    console.log('server started on http://localhost:4000/graphql')
  })
})()
