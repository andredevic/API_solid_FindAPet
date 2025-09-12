import { Org, Prisma, type Pet } from '@prisma/client'

import type { FindAllParams, PetsRepository } from '../pets-repository'
import type { InMemoryOrgsRepository } from './in-memory-orgs-repository'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  constructor(private orgsRepository: InMemoryOrgsRepository) {}

  async findById(id: string): Promise<Pet | null> {
    return this.items.find((item) => item.id === id) ?? null
  }

  async findByIdWithOrg(id: string): Promise<(Pet & { org: Org }) | null> {
    const pet = this.items.find((item) => item.id === id)
    if (!pet) {
      return null
    }

    const org = this.orgsRepository.items.find((item) => item.id === pet.org_id)

    if (!org) {
      throw new Error(
        `Inconsistent data: Org with id ${pet.org_id} not found for pet ${pet.id}`,
      )
    }

    return {
      ...pet,
      org,
    }
  }

  async findAll(params: FindAllParams): Promise<Pet[]> {
    const orgsByCity = this.orgsRepository.items.filter(
      (org) => org.city === params.city,
    )

    const pets = this.items
      .filter((item) => orgsByCity.some((org) => org.id === item.org_id))
      .filter((item) => (params.age ? item.age === params.age : true))
      .filter((item) => (params.size ? item.size === params.size : true))
      .filter((item) =>
        params.energy_level ? item.energy_level === params.energy_level : true,
      )
      .filter((item) =>
        params.environment ? item.environment === params.environment : true,
      )

    return pets
  }

  async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet = {
      id: crypto.randomUUID(),
      name: data.name ?? 'Pet Fictício',
      description: data.description ?? 'Descrição fictícia',
      age: data.age ?? 'Adult',
      size: data.size ?? 'Medium',
      energy_level: data.energy_level ?? 'High',
      environment: data.environment ?? 'Indoor',
      org_id: data.org_id,
      isAdopted: data.isAdopted ?? false,
      created_at: new Date(),
      updated_at: new Date(),
    } as Pet

    this.items.push(pet)
    return pet
  }

  async update(id: string, data: Partial<Pet>): Promise<Pet> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) throw new Error('Pet not found')

    const updatedPet = {
      ...this.items[index],
      ...data,
      updated_at: new Date(),
    }

    this.items[index] = updatedPet
    return updatedPet
  }
}
