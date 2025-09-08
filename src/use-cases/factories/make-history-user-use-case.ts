import { PrismaAdoptionsRepository } from '@/repositories/prisma/prisma-adoptions-repository'
import { GetHistoryAdoptionsUserUseCase } from '../get-history-adoptions-user.use-case'

export function makeHistoryOrgUseCase() {
  return new GetHistoryAdoptionsUserUseCase(new PrismaAdoptionsRepository())
}
