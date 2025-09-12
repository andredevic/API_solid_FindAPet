import { AdoptPetUseCase } from '../adopt.use-case'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { PrismaAdoptionsRepository } from '@/repositories/prisma/prisma-adoptions-repository'

export function makeAdoptUseCase() {
  return new AdoptPetUseCase(
    new PrismaAdoptionsRepository(),
    new PrismaPetsRepository(),
  )
}
