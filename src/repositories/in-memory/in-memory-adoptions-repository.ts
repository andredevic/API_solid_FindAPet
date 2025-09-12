import type { AdoptionsRepository } from '@/repositories/adoptions-repository'
import type { AdoptionWithPetAndUser } from '../../../@types/adoption'
import type { InMemoryUsersRepository } from './in-memory-users-repository'
import { Adoptions } from '@prisma/client'
import { randomUUID } from 'crypto'
import type { InMemoryPetsRepository } from './in-memory-pet-repository'

export class InMemoryAdoptionsRepository implements AdoptionsRepository {
  public items: Adoptions[] = []

  constructor(
    private usersRepository: InMemoryUsersRepository,
    private petsRepository: InMemoryPetsRepository,
  ) {}

  async findManyByUser(userId: string): Promise<AdoptionWithPetAndUser[]> {
    const adoptions = this.items.filter(
      (adoption) => adoption.user_id === userId,
    )

    const adoptionsWithDetails = await Promise.all(
      adoptions.map(async (adoption) => {
        const user = await this.usersRepository.findById(adoption.user_id)
        const petWithOrg = await this.petsRepository.findByIdWithOrg(
          adoption.pet_id,
        )

        if (!user || !petWithOrg) {
          throw new Error(
            'Dados de teste inconsistentes: Usuário ou Pet não encontrado para uma adoção existente.',
          )
        }

        return {
          ...adoption,
          user,
          pet: petWithOrg,
        }
      }),
    )

    return adoptionsWithDetails
  }

  async findManyByOrg(orgId: string): Promise<AdoptionWithPetAndUser[]> {
    const petsFromOrg = this.petsRepository.items.filter(
      (pet) => pet.org_id === orgId,
    )
    const petIdsFromOrg = petsFromOrg.map((pet) => pet.id)

    const adoptions = this.items.filter((adoption) =>
      petIdsFromOrg.includes(adoption.pet_id),
    )

    const adoptionsWithDetails = await Promise.all(
      adoptions.map(async (adoption) => {
        const user = await this.usersRepository.findById(adoption.user_id)
        const petWithOrg = await this.petsRepository.findByIdWithOrg(
          adoption.pet_id,
        )

        if (!user || !petWithOrg) {
          throw new Error(
            'Dados de teste inconsistentes: Usuário ou Pet não encontrado para uma adoção existente.',
          )
        }

        return {
          ...adoption,
          user,
          pet: petWithOrg,
        }
      }),
    )

    return adoptionsWithDetails
  }

  async create(data: { userId: string; petId: string }): Promise<Adoptions> {
    const adoption: Adoptions = {
      id: randomUUID(),
      pet_id: data.petId,
      user_id: data.userId,
    }

    this.items.push(adoption)
    return adoption
  }
}
