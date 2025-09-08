import { InMemoryAdoptionsRepository } from '@/repositories/in-memory/in-memory-adoptions-repository'
import { beforeEach, describe, it, expect } from 'vitest'
import { GetHistoryAdoptionsUserUseCase } from './get-history-adoptions-user.use-case'
import { randomUUID } from 'crypto'

let historyAdoptionsUserRepository: InMemoryAdoptionsRepository
let sut: GetHistoryAdoptionsUserUseCase

describe('History Adoptions User Use Case', () => {
  beforeEach(() => {
    historyAdoptionsUserRepository = new InMemoryAdoptionsRepository()
    sut = new GetHistoryAdoptionsUserUseCase(historyAdoptionsUserRepository)
  })
  it('should be able to get a history of user adoption', async () => {
    const userId = randomUUID()

    await historyAdoptionsUserRepository.create({
      id: randomUUID(),
      user_id: userId,
      pet_id: randomUUID(),
      user: {
        id: userId,
        name: 'User Test',
        email: 'user@test.com',
        password_hash: 'hashed-password',
        phone: '123456789',
        created_at: new Date(),
      },
      pet: {
        id: randomUUID(),
        name: 'Pet 1',
        description: 'A cute pet',
        age: 'young',
        size: 'small',
        energy_level: 'high',
        environment: 'apartment',
        org_id: randomUUID(),
        org: {
          id: randomUUID(),
          name: 'Org 1',
          author_name: 'Author 1',
          email: 'org1@test.com',
          whatsapp: '123456789',
        },
      },
    })

    await historyAdoptionsUserRepository.create({
      id: randomUUID(),
      user_id: userId,
      pet_id: randomUUID(),
      user: {
        id: userId,
        name: 'User Test',
        email: 'user@test.com',
        password_hash: 'hashed-password',
        phone: '123456789',
        created_at: new Date(),
      },
      pet: {
        id: randomUUID(),
        name: 'Pet 2',
        description: 'Another cute pet',
        age: 'adult',
        size: 'medium',
        energy_level: 'low',
        environment: 'house',
        org_id: randomUUID(),
        org: {
          id: randomUUID(),
          name: 'Org 2',
          author_name: 'Author 2',
          email: 'org2@test.com',
          whatsapp: '987654321',
        },
      },
    })

    const { adoptions } = await sut.execute({ userId })

    expect(adoptions).toHaveLength(2)
    expect(adoptions[0].user_id).toBe(userId)
    expect(adoptions[1].user_id).toBe(userId)
  })
})
