import type { AdoptionsRepository } from '@/repositories/adoptions-repository'
import type { Adoptions, Pet } from '@prisma/client'

interface GetHistoryAdoptionsUserUseCaseRequest {
  userId: string
}

interface GetHistoryAdoptionsUserUseCaseResponse {
  adoptions: (Adoptions & { pet: Pet })[]
}

export class GetHistoryAdoptionsUserUseCase {
  constructor(private adoptionsRepository: AdoptionsRepository) {}

  async execute({
    userId,
  }: GetHistoryAdoptionsUserUseCaseRequest): Promise<GetHistoryAdoptionsUserUseCaseResponse> {
    const adoptions = await this.adoptionsRepository.findManyByUser(userId)

    return {
      adoptions,
    }
  }
}
