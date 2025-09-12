import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FetchNearbyOrgsUseCase } from './fetch-nearby-orgs.use-case'
import { hash } from 'bcryptjs'

let orgsRepository: InMemoryOrgsRepository
let sut: FetchNearbyOrgsUseCase

describe('Fetch Nearby Orgs Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new FetchNearbyOrgsUseCase(orgsRepository)
  })

  it('should be able to fetch nearby orgs', async () => {
    await orgsRepository.create({
      name: 'Near org',
      author_name: 'andre',
      email: 'near@example.com',
      whatsapp: '61990384003',
      password_hash: await hash('123456', 6),
      cep: '09837219',
      state: 'minas-gerais',
      city: 'unai',
      neighborhood: 'centro',
      street: 'alba gonzaga',
      latitude: -15.835,
      longitude: -48.036,
    })

    await orgsRepository.create({
      name: 'Far org',
      author_name: 'maria',
      email: 'far@example.com',
      whatsapp: '61999999999',
      password_hash: await hash('654321', 6),
      cep: '00000000',
      state: 'goias',
      city: 'goiania',
      neighborhood: 'bairro qualquer',
      street: 'rua distante',
      latitude: -23.55052,
      longitude: -46.633308,
    })

    const { orgs } = await sut.execute({
      userLatitude: -15.8357863,
      userLongitude: -48.0363827,
    })

    expect(orgs).toHaveLength(1)
    expect(orgs[0].name).toBe('Near org')
  })
})
