import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { Decimal } from '@prisma/client/runtime/library'

describe('Adoptions History Org Controller', () => {
  let token: string

  beforeAll(async () => {
    await app.ready()

    // Cria org
    const password_hash = await hash('123456', 6)
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

    // Autentica org
    const authResponse = await request(app.server).post('/org/sessions').send({
      email: 'ongadote@email.com',
      password: '123456',
    })
    token = authResponse.body.token

    // Cria usuário
    const user_password_hash = await hash('654321', 6)
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        password_hash: user_password_hash,
        phone: '11999999999',
      },
    })

    // Cria pet
    const pet = await prisma.pet.create({
      data: {
        name: 'Rex',
        description: 'Cachorro amigável',
        age: 'ADULT',
        size: 'MEDIUM',
        energy_level: 'HIGH',
        environment: 'HOUSE',
        org_id: org.id,
      },
    })

    // Marca adoção
    await prisma.adoptions.create({
      data: {
        user_id: user.id,
        pet_id: pet.id,
      },
    })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch the adoption history of an org', async () => {
    const response = await request(app.server)
      .get('/orgs/adoptions/history')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.adoptions).toBeInstanceOf(Array)
    expect(response.body.adoptions.length).toBeGreaterThanOrEqual(1)
  })
})
