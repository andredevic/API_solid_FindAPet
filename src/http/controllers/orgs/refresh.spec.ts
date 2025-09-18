import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

describe('Refresh Token de ORG (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('deve ser capaz de atualizar um token de ORG', async () => {
    await prisma.org.create({
      data: {
        name: 'ONG Patinhas Felizes',
        author_name: 'João da Silva',
        email: 'contato@patinhasfelizes.com',
        password_hash: await hash('senha-super-secreta', 6),
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

    const authResponse = await request(app.server).post('/org/sessions').send({
      email: 'contato@patinhasfelizes.com',
      password: 'senha-super-secreta',
    })

    const cookies = authResponse.get('Set-Cookie')
    if (!cookies) {
      throw new Error('O cookie de refresh token não foi recebido.')
    }

    const response = await request(app.server)
      .patch('/orgs/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
