import { createConnection } from 'typeorm'

export const testConn = (drop: boolean = false) => {
  return createConnection({
    type: 'sqlite',
    database: 'database-test.sqlite',
    synchronize: drop,
    dropSchema: drop,
    logging: false,
    entities: [__dirname + '/../entity/**/*.ts'],
  })
}
