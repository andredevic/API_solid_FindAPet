import { AuthenticateUseCase } from '../authenticate-users.use-case'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-user-repository'

export function makeAuthenticateUserUseCase() {
  return new AuthenticateUseCase(new PrismaUsersRepository())
}
