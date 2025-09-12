import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Authenticate User Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate a user', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password: '123456',
      phone: '11999999999',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'john.doe@email.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty('token')
  })
})
