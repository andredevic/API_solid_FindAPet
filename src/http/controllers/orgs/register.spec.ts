import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Register Org Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register an org', async () => {
    const response = await request(app.server).post('/orgs').send({
      name: 'ONG Amigos dos Pets',
      author_name: 'Maria Silva',
      email: 'ongamigos@example.com',
      whatsapp: '11999999999',
      password: '123456',
      cep: '01234567',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Centro',
      street: 'Rua das Flores',
      latitude: -23.55052,
      longitude: -46.633308,
    })

    expect(response.statusCode).toEqual(201)
  })
})
