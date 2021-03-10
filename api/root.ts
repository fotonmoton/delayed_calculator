import { Server } from 'http'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { config } from 'dotenv'
import { connect } from '../db/connection'
import { Context } from './context'
import { calculatorRoutes } from './calculator'

export const main = async (): Promise<Server> => {
  config()
  const app = new Koa<unknown, Context>()

  app.context.dbPool = connect()
  app.use(bodyParser())
  app.use(calculatorRoutes.routes())
  console.log(`listening on ${process.env.API_PORT}`)
  return app.listen(process.env.API_PORT)
}
