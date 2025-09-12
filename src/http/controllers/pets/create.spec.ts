import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { Decimal } from '@prisma/client/runtime/library'

describe('Create Pet Controller', () => {
  let token: string
  let orgId: string

  beforeAll(async () => {
    await app.ready()

    const password_hash = await hash('123456', 6)
    const org = await prisma.org.create({
      data: {
        name: 'ONG Pets',
        author_name: 'Maria',
        email: 'ongpets@email.com',
        whatsapp: '11988887777',
        password_hash,
        cep: '01234567',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Centro',
        street: 'Rua das Flores',
        latitude: new Decimal(-23.55052),
        longitude: new Decimal(-46.633308),
      },
    })
    orgId = org.id

    const authResponse = await request(app.server).post('/org/sessions').send({
      email: 'ongpets@email.com',
      password: '123456',
    })
    token = authResponse.body.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a pet', async () => {
    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        orgId,
        name: 'Rex',
        description: 'Cachorro amigável',
        age: 'ADULT',
        size: 'MEDIUM',
        energy_level: 'HIGH',
        environment: 'HOUSE',
      })

    expect(response.statusCode).toEqual(201)
  })
})
