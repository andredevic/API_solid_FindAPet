import { beforeEach, describe, it, expect } from 'vitest'
import { randomUUID } from 'node:crypto'
import { GetHistoryAdoptionsOrgUseCase } from './get-history-adoptions-org.use-case'
import { InMemoryAdoptionsRepository } from '@/repositories/in-memory/in-memory-adoptions-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { makeOrg } from 'tests/factories/make-org.factory'
import { makePet } from 'tests/factories/make-pet.factory'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pet-repository'

describe('History Adoptions Org Use Case', () => {
  let usersRepository: InMemoryUsersRepository
  let orgsRepository: InMemoryOrgsRepository
  let petsRepository: InMemoryPetsRepository
  let adoptionsRepository: InMemoryAdoptionsRepository
  let sut: GetHistoryAdoptionsOrgUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    adoptionsRepository = new InMemoryAdoptionsRepository(
      usersRepository,
      petsRepository,
    )
    sut = new GetHistoryAdoptionsOrgUseCase(adoptionsRepository)
  })

  it('should be able to get a history of an org adoptions', async () => {
    const user = {
      id: randomUUID(),
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: 'hashed-password',
      phone: '11999999999',
      created_at: new Date(),
    }
    usersRepository.items.push(user)

    const orgA = makeOrg()
    const orgB = makeOrg()
    orgsRepository.items.push(orgA, orgB)

    const pet1OrgA = {
      ...makePet({ org_id: orgA.id }),
      isAdopted: true,
      created_at: new Date(),
      updated_at: new Date(),
    }
    const pet2OrgA = {
      ...makePet({ org_id: orgA.id }),
      isAdopted: true,
      created_at: new Date(),
      updated_at: new Date(),
    }
    const pet1OrgB = {
      ...makePet({ org_id: orgB.id }),
      isAdopted: true,
      created_at: new Date(),
      updated_at: new Date(),
    }
    petsRepository.items.push(pet1OrgA, pet2OrgA, pet1OrgB)

    await adoptionsRepository.create({ userId: user.id, petId: pet1OrgA.id })
    await adoptionsRepository.create({ userId: user.id, petId: pet2OrgA.id })
    await adoptionsRepository.create({ userId: user.id, petId: pet1OrgB.id })

    const { adoptions } = await sut.execute({ orgId: orgA.id })

    expect(adoptions).toHaveLength(2)
    expect(adoptions[0].pet.org_id).toBe(orgA.id)
    expect(adoptions[1].pet.org_id).toBe(orgA.id)
  })
})
