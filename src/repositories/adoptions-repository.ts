import type { Adoptions } from '@prisma/client'
import type { AdoptionWithPetAndUser } from '../../@types/adoption'

export interface AdoptionsRepository {
  create(data: { userId: string; petId: string }): Promise<Adoptions>
  findManyByUser(userId: string): Promise<AdoptionWithPetAndUser[]>
  findManyByOrg(orgId: string): Promise<AdoptionWithPetAndUser[]>
}
