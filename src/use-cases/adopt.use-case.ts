import type { AdoptionsRepository } from '@/repositories/adoptions-repository'
import type { PetsRepository } from '@/repositories/pets-repository'

interface AdoptPetUseCaseRequest {
  userId: string
  petId: string
}

export class AdoptPetUseCase {
  constructor(
    private adoptionsRepository: AdoptionsRepository,
    private petsRepository: PetsRepository,
  ) {}

  async execute({ userId, petId }: AdoptPetUseCaseRequest) {
    const pet = await this.petsRepository.findById(petId)

    if (!pet) {
      throw new Error('Pet não encontrado')
    }

    if (pet.isAdopted) {
      throw new Error('Pet já foi adotado')
    }

    await this.petsRepository.update(petId, { isAdopted: true })

    const adoption = await this.adoptionsRepository.create({
      userId,
      petId,
    })

    return adoption
  }
}
