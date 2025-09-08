import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { CreateOrgUseCase } from './create-org.use-case'
import { beforeEach, describe, expect, it } from 'vitest'
import { compare } from 'bcryptjs'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'

let orgsRepository: InMemoryOrgsRepository
let sut: CreateOrgUseCase

describe('Create Org Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new CreateOrgUseCase(orgsRepository)
  })
  it('should be able to create a org', async () => {
    const { org } = await sut.execute({
      name: 'orgJavascript',
      author_name: 'andre',
      email: 'andre@andre.com',
      whatsapp: '61990384003',
      password: '123456',
      cep: '09837219',
      state: 'minas-gerais',
      city: 'unai',
      neighborhood: 'centro',
      street: 'alba gonzaga',
      latitude: -23.55052,
      longitude: -46.633308,
    })

    expect(org.id).toEqual(expect.any(String))
  })
  it('should hash org password upon registration', async () => {
    const { org } = await sut.execute({
      name: 'orgJavascript',
      author_name: 'andre',
      email: 'andre@andre.com',
      whatsapp: '61990384003',
      password: '123456',
      cep: '09837219',
      state: 'minas-gerais',
      city: 'unai',
      neighborhood: 'centro',
      street: 'alba gonzaga',
      latitude: -23.55052,
      longitude: -46.633308,
    })

    const isPasswordCorrectlyHashed = await compare('123456', org.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'andre@example.com'

    await sut.execute({
      name: 'orgJavascript',
      author_name: 'andre',
      email,
      whatsapp: '61990384003',
      password: '123456',
      cep: '09837219',
      state: 'minas-gerais',
      city: 'unai',
      neighborhood: 'centro',
      street: 'alba gonzaga',
      latitude: -23.55052,
      longitude: -46.633308,
    })

    await expect(
      sut.execute({
        name: 'orgJavascript',
        author_name: 'andre',
        email,
        whatsapp: '61990384003',
        password: '123456',
        cep: '09837219',
        state: 'minas-gerais',
        city: 'unai',
        neighborhood: 'centro',
        street: 'alba gonzaga',
        latitude: -23.55052,
        longitude: -46.633308,
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })
})
