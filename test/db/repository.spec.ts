import test from 'ava'
import { config } from 'dotenv'
import { connect } from '../../db/connection'
import {
  addRequest,
  addResult,
  truncateRequests,
  truncateResults,
  unhandledRequests,
} from '../../db/repository'

config()
const dbPool = connect()

test.beforeEach(async () => {
  await truncateRequests(dbPool)
  await truncateResults(dbPool)
})

test.serial('can add request', (t) =>
  addRequest(dbPool, { left: '1', right: '2', operator: '+' }).then((result) =>
    t.true(!!result.id)
  )
)

test.serial('can get unhandled requests', async (t) => {
  const request = { left: '1', right: '2', operator: '+' }
  const empty = await unhandledRequests(dbPool)
  const added = await addRequest(dbPool, request)
  const one = await unhandledRequests(dbPool)

  t.deepEqual(empty, [])
  t.deepEqual(one, [added])
})

test.serial('can add result', (t) =>
  addResult(dbPool, { requestId: 1, result: '123' }).then((res) =>
    t.true(!!res.id)
  )
)

test.serial('unhandledRequests ignores handled requests', async (t) => {
  const request = { left: '1', right: '2', operator: '+' }
  const added = await addRequest(dbPool, request)
  const one = await unhandledRequests(dbPool)
  await addResult(dbPool, { requestId: added.id, result: '3' })
  const againEmpty = await unhandledRequests(dbPool)

  t.deepEqual(one, [added])
  t.deepEqual(againEmpty, [])
})
