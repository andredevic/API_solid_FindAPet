import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Get Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('deve ser capaz de obter um pet pelo seu id', async () => {
    const org = await prisma.org.create({
      data: {
        name: 'ONG Patinhas Felizes',
        author_name: 'João da Silva',
        email: 'contato@patinhasfelizes.com',
        password_hash: 'senha-super-secreta',
        whatsapp: '11999999999',
        cep: '01001000',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Centro',
        street: 'Rua da Consolação',
        latitude: -23.55,
        longitude: -46.64,
      },
    })

    const pet = await prisma.pet.create({
      data: {
        name: 'Bolinha',
        description: 'Um cãozinho muito amigável.',
        age: 'Filhote',
        size: 'Pequeno',
        energy_level: 'Alto',
        environment: 'Ambiente Interno',
        org_id: org.id,
      },
    })

    const response = await request(app.server).get(`/pets/${pet.id}`).send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.pet).toEqual(
      expect.objectContaining({
        name: 'Bolinha',
        id: pet.id,
      }),
    )
  })

  it('deve retornar 404 se o pet não for encontrado', async () => {
    const nonExistentId = 'f4b1d1e1-7c1e-4b1d-8c1e-1b1d1e1b1d1e'

    const response = await request(app.server)
      .get(`/pets/${nonExistentId}`)
      .send()

    expect(response.statusCode).toEqual(404)
  })
})
