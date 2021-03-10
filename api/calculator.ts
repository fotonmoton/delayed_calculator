import Router from '@koa/router'
import { addRequest, getRequest } from '../db/repository'
import { Context } from './context'

const calculatorRoutes = new Router<unknown, Context>()

calculatorRoutes.post('/calculate', async (ctx) => {
  const {
    dbPool,
    request: { body },
  } = ctx
  ctx.body = await addRequest(dbPool, body)
})

calculatorRoutes.get('/request/:id', async (ctx) => {
  const {
    dbPool,
    params: { id },
  } = ctx
  ctx.body = await getRequest(dbPool, Number(id))
})

export { calculatorRoutes }
