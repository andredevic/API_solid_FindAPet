import { AdoptionWithPetAndUser } from '@/@types/adoption'
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

  async create(adoption: AdoptionWithPetAndUser): Promise<void> {
    await prisma.adoptions.create({
      data: {
        id: adoption.id,
        pet_id: adoption.pet_id,
        user_id: adoption.user_id,
      },
    })
  }
}
