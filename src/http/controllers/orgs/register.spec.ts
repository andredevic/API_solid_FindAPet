import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

describe('Register Org Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('deve ser capaz de registar uma org', async () => {
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password_hash: await hash('admin-password', 6),
        phone: '11999999999',
        role: 'ADMIN',
      },
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'admin@example.com',
      password: 'admin-password',
    })

    const { token } = authResponse.body

    const response = await request(app.server)
      .post('/orgs')
      .set('Authorization', `Bearer ${token}`)
      .send({
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
