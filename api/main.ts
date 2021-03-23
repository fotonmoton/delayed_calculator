import { Server } from 'http'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { config } from 'dotenv'
import { connect } from '../db/connection'
import { Context } from './context'
import { calculatorRoutes } from './calculator'

export const main = (): Server => {
  config()
  const dbPool = connect()
  const app = new Koa<unknown, Context>()

  app.context.dbPool = dbPool
  app.use(bodyParser())
  app.use(calculatorRoutes.routes())
  return app.listen(process.env.API_PORT)
}
