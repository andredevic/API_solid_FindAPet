import { prisma } from '@/lib/prisma'
import type { UsersRepository } from '../users-repository'
import type { Prisma } from '@prisma/client'

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string) {
    const User = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return User
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
