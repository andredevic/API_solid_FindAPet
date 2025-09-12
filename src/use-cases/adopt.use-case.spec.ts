import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryAdoptionsRepository } from '@/repositories/in-memory/in-memory-adoptions-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { makeOrg } from 'tests/factories/make-org.factory'
import { makePet } from 'tests/factories/make-pet.factory'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AdoptPetUseCase } from './adopt.use-case'
import { randomUUID } from 'node:crypto'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pet-repository'

describe('AdoptPetUseCase', () => {
  let petsRepository: InMemoryPetsRepository
  let adoptionsRepository: InMemoryAdoptionsRepository
  let orgsRepository: InMemoryOrgsRepository
  let usersRepository: InMemoryUsersRepository
  let adoptPetUseCase: AdoptPetUseCase

  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    usersRepository = new InMemoryUsersRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)

    adoptionsRepository = new InMemoryAdoptionsRepository(
      usersRepository,
      petsRepository,
    )

    adoptPetUseCase = new AdoptPetUseCase(adoptionsRepository, petsRepository)
  })

  it('should allow a user to adopt a pet', async () => {
    const org = makeOrg()
    orgsRepository.items.push(org)

    const pet = {
      ...makePet({ org_id: org.id }),
      isAdopted: false,
      created_at: new Date(),
      updated_at: new Date(),
    }
    petsRepository.items.push(pet)

    const user = {
      id: randomUUID(),
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: 'hashed-password',
      phone: '11999999999',
      created_at: new Date(),
    }
    usersRepository.items.push(user)

    const adoption = await adoptPetUseCase.execute({
      userId: user.id,
      petId: pet.id,
    })

    expect(adoption.pet_id).toBe(pet.id)
    expect(adoption.user_id).toBe(user.id)

    const updatedPet = await petsRepository.findById(pet.id)
    expect(updatedPet?.isAdopted).toBe(true)
  })

  it('should throw an error if pet is not found', async () => {
    await expect(
      adoptPetUseCase.execute({
        userId: 'user-id-qualquer',
        petId: 'non-existent-id',
      }),
    ).rejects.toThrow('Pet não encontrado')
  })

  it('should throw an error if pet is already adopted', async () => {
    const org = makeOrg()
    orgsRepository.items.push(org)

    const pet = {
      ...makePet({ org_id: org.id }),
      isAdopted: true,
      created_at: new Date(),
      updated_at: new Date(),
    }
    petsRepository.items.push(pet)

    const user = {
      id: randomUUID(),
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password_hash: 'hashed-password',
      phone: '11988888888',
      created_at: new Date(),
    }
    usersRepository.items.push(user)

    await expect(
      adoptPetUseCase.execute({
        userId: user.id,
        petId: pet.id,
      }),
    ).rejects.toThrow('Pet já foi adotado')
  })
})
