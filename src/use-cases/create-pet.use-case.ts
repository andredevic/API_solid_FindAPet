import type { OrgsRepository } from '@/repositories/orgs-repository'
import type { PetsRepository } from '@/repositories/pets-repository'
import type { Pet } from '@prisma/client'
import { OrgNotFoundError } from './errors/org-not-found-error'

interface CreatePetUseCaseRequest {
  org_id: string
  name: string
  description: string
  age: string
  size: string
  energy_level: string
  environment: string
}

interface CreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(
    private orgsRepository: OrgsRepository,
    private petsRepository: PetsRepository,
  ) {}

  async execute({
    org_id,
    name,
    description,
    age,
    size,
    energy_level,
    environment,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const org = await this.orgsRepository.findById(org_id)

    if (!org) {
      throw new OrgNotFoundError()
    }

    const pet = await this.petsRepository.create({
      org_id,
      name,
      description,
      age,
      size,
      energy_level,
      environment,
    })

    return {
      pet,
    }
  }
}
