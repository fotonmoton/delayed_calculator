import Koa from 'koa'
import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'

const app = new Koa()
const router = new Router()

interface CalculateArguments {
  operator: string
  left: string
  right: string
}

router.post('/calculate', (ctx) => {
  const { left, right, operator }: CalculateArguments = ctx.request.body
  // eslint-disable-next-line no-eval
  ctx.body = eval(`${left} ${operator} ${right}`)
})

app.use(bodyParser())
app.use(router.routes())

const port = 3000
console.log(port)
app.listen(port)
