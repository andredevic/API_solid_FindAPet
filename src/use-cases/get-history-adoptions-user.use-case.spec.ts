import { beforeEach, describe, it, expect } from 'vitest'
import { GetHistoryAdoptionsUserUseCase } from './get-history-adoptions-user.use-case'
import { randomUUID } from 'node:crypto'
import { InMemoryAdoptionsRepository } from '@/repositories/in-memory/in-memory-adoptions-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { makeOrg } from 'tests/factories/make-org.factory'
import { makePet } from 'tests/factories/make-pet.factory'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pet-repository'

describe('History Adoptions User Use Case', () => {
  let usersRepository: InMemoryUsersRepository
  let orgsRepository: InMemoryOrgsRepository
  let petsRepository: InMemoryPetsRepository
  let adoptionsRepository: InMemoryAdoptionsRepository
  let sut: GetHistoryAdoptionsUserUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    adoptionsRepository = new InMemoryAdoptionsRepository(
      usersRepository,
      petsRepository,
    )
    sut = new GetHistoryAdoptionsUserUseCase(adoptionsRepository)
  })

  it('should be able to get a history of user adoption', async () => {
    const user = {
      id: randomUUID(),
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: 'hashed-password',
      phone: '11999999999',
      created_at: new Date(),
    }
    usersRepository.items.push(user)

    const org = makeOrg()
    orgsRepository.items.push(org)

    const pet1 = {
      ...makePet({ org_id: org.id }),
      isAdopted: true,
      created_at: new Date(),
      updated_at: new Date(),
    }
    const pet2 = {
      ...makePet({ org_id: org.id }),
      isAdopted: true,
      created_at: new Date(),
      updated_at: new Date(),
    }
    petsRepository.items.push(pet1, pet2)

    await adoptionsRepository.create({ userId: user.id, petId: pet1.id })
    await adoptionsRepository.create({ userId: user.id, petId: pet2.id })

    const { adoptions } = await sut.execute({ userId: user.id })

    expect(adoptions).toHaveLength(2)
    expect(adoptions[0].user_id).toBe(user.id)
    expect(adoptions[1].user_id).toBe(user.id)
    expect(adoptions[0].pet.name).toBe(pet1.name)
  })
})
