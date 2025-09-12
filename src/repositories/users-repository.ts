import type { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  findById(id: string): Promise<User | null> // <-- MÉTODO ADICIONADO
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}
