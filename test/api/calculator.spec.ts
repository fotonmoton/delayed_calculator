import test from 'ava'
import { agent } from 'supertest'
import { main } from '../../api/main'

const server = main()
const request = agent(server)

test('should return created request', (t) =>
  request
    .post('/calculate')
    .send({ left: '10', right: '2', operator: '*' })
    .expect(200)
    .then((response) =>
      t.deepEqual(
        Object.keys(response.body).sort(),
        ['id', 'left', 'right', 'operator'].sort()
      )
    ))

test('can get created request', (t) =>
  request
    .post('/calculate')
    .send({ left: '10', right: '2', operator: '*' })
    .expect(200)
    .then((created) =>
      request
        .get(`/request/${created.body.id}`)
        .expect(200)
        .then((fetched) => t.deepEqual(created.body, fetched.body))
    ))
