import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function createPet(request: FastifyRequest, reply: FastifyReply) {
  const createPetBodySchema = z.object({
    orgId: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    age: z.string(),
    size: z.string(),
    energy_level: z.string(),
    environment: z.string(),
  })

  const { orgId, name, description, age, size, energy_level, environment } =
    createPetBodySchema.parse(request.body)

  const createPetUseCase = makeCreatePetUseCase()

  await createPetUseCase.execute({
    org_id: orgId,
    name,
    description,
    age,
    size,
    energy_level,
    environment,
  })

  return reply.status(201).send()
}
