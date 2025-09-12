import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { Decimal } from '@prisma/client/runtime/library'

describe('Search Pets Controller', () => {
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

    await prisma.pet.create({
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

    await prisma.pet.create({
      data: {
        name: 'Fido',
        description: 'Cachorro brincalhão',
        age: 'PUPPY',
        size: 'SMALL',
        energy_level: 'LOW',
        environment: 'APARTMENT',
        org_id: org.id,
      },
    })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search pets by city', async () => {
    const response = await request(app.server)
      .get('/pets/search')
      .query({ city: 'São Paulo' })

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(2)
    expect(response.body.pets[0]).toHaveProperty('name')
  })

  it('should be able to filter pets by age', async () => {
    const response = await request(app.server)
      .get('/pets/search')
      .query({ city: 'São Paulo', age: 'PUPPY' })

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets[0].name).toBe('Fido')
  })
})
