import { PrismaUsersRepository } from '@/repositories/prisma/prisma-user-repository'
import { RegisterUseCase } from '../register-user.use-case'

export function makeRegisterUserUseCase() {
  return new RegisterUseCase(new PrismaUsersRepository())
}
