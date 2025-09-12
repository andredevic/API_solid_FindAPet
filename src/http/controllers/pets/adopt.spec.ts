import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { Decimal } from '@prisma/client/runtime/library'

describe('Adopt Pet Controller', () => {
  let token: string
  let petId: string

  beforeAll(async () => {
    await app.ready()

    const password_hash = await hash('123456', 6)
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        password_hash,
        phone: '11999999999',
      },
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'john.doe@email.com',
      password: '123456',
    })
    token = authResponse.body.token

    const org = await prisma.org.create({
      data: {
        name: 'ONG Adote',
        author_name: 'Maria',
        email: 'ongadote@email.com',
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

    const pet = await prisma.pet.create({
      data: {
        name: 'Rex',
        description: 'Cachorro amigável',
        age: '2',
        size: 'MEDIUM',
        energy_level: '3',
        environment: 'HOUSE',
        org_id: org.id,
      },
    })
    petId = pet.id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to adopt a pet', async () => {
    const response = await request(app.server)
      .post(`/pets/${petId}/adopt`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)
  })
})
