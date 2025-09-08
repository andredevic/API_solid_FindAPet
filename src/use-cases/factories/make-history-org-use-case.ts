import { GetHistoryAdoptionsOrgUseCase } from '../get-history-adoptions-org.use-case'
import { PrismaAdoptionsRepository } from '@/repositories/prisma/prisma-adoptions-repository'

export function makeHistoryOrgUseCase() {
  return new GetHistoryAdoptionsOrgUseCase(new PrismaAdoptionsRepository())
}
