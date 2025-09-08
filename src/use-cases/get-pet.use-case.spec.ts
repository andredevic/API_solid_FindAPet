import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pet-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetPetUseCase } from './get-pet.use-case'
import { makePet } from 'tests/factories/make-pet.factory'
import { PetNotFoundError } from './errors/pet-not-found.error'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'

describe('Get Pet Use Case', () => {
  let petsRepository: InMemoryPetsRepository
  let orgsRepository: InMemoryOrgsRepository
  let sut: GetPetUseCase

  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new GetPetUseCase(petsRepository)
  })

  it('should be able to get a new pet', async () => {
    const pet = await petsRepository.create(makePet())
    const result = await sut.execute({ id: pet.id })

    expect(result.pet).toEqual(pet)
  })

  it('should not be able to get a non-existing pet', async () => {
    await expect(sut.execute({ id: 'invalid' })).rejects.toBeInstanceOf(
      PetNotFoundError,
    )
  })
})
