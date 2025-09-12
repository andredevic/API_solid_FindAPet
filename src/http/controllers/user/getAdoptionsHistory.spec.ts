import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { Decimal } from '@prisma/client/runtime/library'

describe('Adoptions History (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch the adoption history of a user', async () => {
    const password_hash = await hash('password123', 6)

    const org = await prisma.org.create({
      data: {
        name: 'Org Adota Cão',
        author_name: 'Maria da Silva',
        email: 'contato@adotacao.com',
        whatsapp: '11987654321',
        password_hash,
        cep: '01001000',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Centro',
        street: 'Rua dos Filhotes, 123',
        latitude: new Decimal(-23.55052),
        longitude: new Decimal(-46.633308),
      },
    })

    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        password_hash,
        phone: '11999998888',
      },
    })

    const pet1 = await prisma.pet.create({
      data: {
        name: 'Fido',
        description: 'Um cachorrinho muito amigável',
        age: 'PUPPY',
        energy_level: 'HIGH',
        environment: 'LARGE',
        size: 'SMALL',
        org_id: org.id,
      },
    })

    const pet2 = await prisma.pet.create({
      data: {
        name: 'Rex',
        description: 'Um gigante gentil',
        age: 'ADULT',
        energy_level: 'LOW',
        environment: 'LARGE',
        size: 'LARGE',
        org_id: org.id,
      },
    })

    await prisma.adoptions.create({
      data: { pet_id: pet1.id, user_id: user.id },
    })
    await prisma.adoptions.create({
      data: { pet_id: pet2.id, user_id: user.id },
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'john.doe@email.com',
      password: 'password123',
    })

    const { token } = authResponse.body

    const response = await request(app.server)
      .get('/user/adoptions/history')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.adoptions).toHaveLength(2)

    expect(response.body.adoptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ pet_id: pet1.id, user_id: user.id }),
        expect.objectContaining({ pet_id: pet2.id, user_id: user.id }),
      ]),
    )
  })
})
