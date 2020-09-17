import 'reflect-metadata'
import { createConnection } from 'typeorm'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { ProjectResolver } from './modules/project/ProjectResolver'
import { UserResolver } from './modules/user/Register'
;(async () => {
  await createConnection()
  const schema = await buildSchema({
    resolvers: [ProjectResolver, UserResolver],
  })

  const apolloServer = new ApolloServer({
    schema,
  })

  const app = express()

  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(4000, () => {
    console.log('express server started')
  })
})()
