import type { AdoptionWithPetAndUser } from '@/@types/adoption'

export interface AdoptionsRepository {
  findManyByUser(userId: string): Promise<AdoptionWithPetAndUser[]>
  findManyByOrg(orgId: string): Promise<AdoptionWithPetAndUser[]>
}
