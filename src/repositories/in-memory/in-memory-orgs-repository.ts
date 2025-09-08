import type { Org, Prisma } from '@prisma/client'

import { randomUUID } from 'node:crypto'
import { Decimal } from '@prisma/client/runtime/library'
import type { FindManyNearbyParams, OrgsRepository } from '../orgs-repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = []

  async findById(id: string): Promise<Org | null> {
    return this.items.find((org) => org.id === id) || null
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)
    if (!user) {
      return null
    }
    return user
  }

  async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )

      return distance < 10
    })
  }

  async create(data: Prisma.OrgCreateInput) {
    const org = {
      id: randomUUID(),
      ...data,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      created_at: new Date(),
    }
    this.items.push(org)

    return org
  }
}
