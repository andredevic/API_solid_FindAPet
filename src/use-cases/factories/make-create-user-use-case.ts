import { PrismaUsersRepository } from '@/repositories/prisma/prisma-user-repository'
import { RegisterUseCase } from '../register-user.use-case'

export function makeCreateUserUseCase() {
  return new RegisterUseCase(new PrismaUsersRepository())
}
