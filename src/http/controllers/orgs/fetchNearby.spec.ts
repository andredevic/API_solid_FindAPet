import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { Decimal } from '@prisma/client/runtime/library'

describe('Fetch Nearby Orgs Controller', () => {
  beforeAll(async () => {
    await app.ready()

    const password_hash = await hash('123456', 6)

    await prisma.org.create({
      data: {
        name: 'ONG Centro',
        author_name: 'Maria',
        email: 'centro@email.com',
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

    await prisma.org.create({
      data: {
        name: 'ONG Longe',
        author_name: 'João',
        email: 'longe@email.com',
        whatsapp: '11988887778',
        password_hash,
        cep: '01234568',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Zona Norte',
        street: 'Rua dos Pinheiros',
        latitude: new Decimal(-23.6),
        longitude: new Decimal(-46.7),
      },
    })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch nearby orgs', async () => {
    const response = await request(app.server).get('/orgs/nearby').query({
      latitude: -23.55052,
      longitude: -46.633308,
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body.orgs.length).toBeGreaterThanOrEqual(1)
    expect(response.body.orgs[0]).toHaveProperty('name')
  })
})
