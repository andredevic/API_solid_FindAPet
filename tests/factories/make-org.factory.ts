import { faker } from '@faker-js/faker'
import crypto from 'node:crypto'
import { Decimal } from '@prisma/client/runtime/library'

type Overwrite = {
  password?: string
}

export function makeOrg(overwrite?: Overwrite) {
  return {
    id: crypto.randomUUID(),
    author_name: faker.person.fullName(),
    cep: faker.location.zipCode(),
    city: faker.location.city(),
    email: faker.internet.email(),
    latitude: new Decimal(faker.location.latitude()),
    longitude: new Decimal(faker.location.longitude()),
    name: faker.company.name(),
    neighborhood: faker.location.streetAddress(),
    password_hash: overwrite?.password ?? faker.internet.password(),
    state: faker.location.state(),
    street: faker.location.street(),
    whatsapp: faker.phone.number(),
    created_at: new Date(),
  }
}
