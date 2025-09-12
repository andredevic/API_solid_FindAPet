import type { AdoptionsRepository } from '@/repositories/adoptions-repository'
import type { AdoptionWithPetAndUser } from '../../@types/adoption' // Importando o tipo completo

interface GetHistoryAdoptionsUserUseCaseRequest {
  userId: string
}

interface GetHistoryAdoptionsUserUseCaseResponse {
  adoptions: AdoptionWithPetAndUser[]
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
