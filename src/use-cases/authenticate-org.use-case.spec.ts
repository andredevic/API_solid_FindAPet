import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { AuthenticateOrgUseCase } from './authenticate-org.use-case'
import { hash } from 'bcryptjs'

let orgsRepository: InMemoryOrgsRepository
let sut: AuthenticateOrgUseCase

describe('Authenticate Org Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new AuthenticateOrgUseCase(orgsRepository)
  })

  it('should be able to authenticate an org', async () => {
    await orgsRepository.create({
      name: 'orgJavascript',
      author_name: 'andre',
      email: 'andre@andre.com',
      whatsapp: '61990384003',
      password_hash: await hash('123456', 6),
      cep: '09837219',
      state: 'minas-gerais',
      city: 'unai',
      neighborhood: 'centro',
      street: 'alba gonzaga',
      latitude: -23.55052,
      longitude: -46.633308,
    })

    const { org } = await sut.execute({
      email: 'andre@andre.com',
      password: '123456',
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate an org with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'andre@andre.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await orgsRepository.create({
      name: 'orgJavascript',
      author_name: 'andre',
      email: 'andre@andre.com',
      whatsapp: '61990384003',
      password_hash: await hash('123456', 6),
      cep: '09837219',
      state: 'minas-gerais',
      city: 'unai',
      neighborhood: 'centro',
      street: 'alba gonzaga',
      latitude: -23.55052,
      longitude: -46.633308,
    })

    await expect(() =>
      sut.execute({
        email: 'andre@andre.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
