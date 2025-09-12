import type { Adoptions } from '@prisma/client'
import { AdoptionWithPetAndUser } from '../../../@types/adoption'
import { AdoptionsRepository } from '../adoptions-repository'
import { prisma } from '@/lib/prisma'

export class PrismaAdoptionsRepository implements AdoptionsRepository {
  async findManyByUser(userId: string): Promise<AdoptionWithPetAndUser[]> {
    const adoptions = await prisma.adoptions.findMany({
      where: { user_id: userId },
      include: {
        pet: {
          include: {
            org: true,
          },
        },
        user: true,
      },
    })

    return adoptions
  }

  async findManyByOrg(orgId: string): Promise<AdoptionWithPetAndUser[]> {
    const adoptions = await prisma.adoptions.findMany({
      where: {
        pet: { org_id: orgId },
      },
      include: {
        pet: {
          include: {
            org: true,
          },
        },
        user: true,
      },
    })

    return adoptions
  }

  async create(data: { userId: string; petId: string }): Promise<Adoptions> {
    const adoption = await prisma.adoptions.create({
      data: {
        pet_id: data.petId,
        user_id: data.userId,
      },
    })

    return adoption
  }
}
