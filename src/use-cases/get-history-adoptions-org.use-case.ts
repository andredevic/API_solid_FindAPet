import type { AdoptionsRepository } from '@/repositories/adoptions-repository'
import type { Adoptions, Pet, User } from '@prisma/client'

interface GetHistoryAdoptionsOrgUseCaseRequest {
  orgId: string
}

interface GetHistoryAdoptionsOrgUseCaseResponse {
  adoptions: (Adoptions & { pet: Pet; user: User })[]
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
