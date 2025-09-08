import type { AdoptionsRepository } from '@/repositories/adoptions-repository'
import type { AdoptionWithPetAndUser } from '@/@types/adoption'

export class InMemoryAdoptionsRepository implements AdoptionsRepository {
  private items: AdoptionWithPetAndUser[] = []

  async findManyByUser(userId: string): Promise<AdoptionWithPetAndUser[]> {
    return this.items.filter((adoption) => adoption.user_id === userId)
  }

  async findManyByOrg(orgId: string): Promise<AdoptionWithPetAndUser[]> {
    return this.items.filter((adoption) => adoption.pet.org_id === orgId)
  }

  async create(adoption: AdoptionWithPetAndUser): Promise<void> {
    this.items.push(adoption)
  }
}
