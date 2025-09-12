import type { AdoptionsRepository } from '@/repositories/adoptions-repository'
import type { AdoptionWithPetAndUser } from '../../@types/adoption' // Importando o tipo completo

interface GetHistoryAdoptionsOrgUseCaseRequest {
  orgId: string
}

interface GetHistoryAdoptionsOrgUseCaseResponse {
  adoptions: AdoptionWithPetAndUser[]
}

export class GetHistoryAdoptionsOrgUseCase {
  constructor(private adoptionsRepository: AdoptionsRepository) {}

  async execute({
    orgId,
  }: GetHistoryAdoptionsOrgUseCaseRequest): Promise<GetHistoryAdoptionsOrgUseCaseResponse> {
    const adoptions = await this.adoptionsRepository.findManyByOrg(orgId)

    return {
      adoptions,
    }
  }
}
