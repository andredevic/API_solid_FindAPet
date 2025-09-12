import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetPetUseCase } from '@/use-cases/factories/make-get-pet-use-case'
import { PetNotFoundError } from '@/use-cases/errors/pet-not-found.error'

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const getPetParamsSchema = z.object({
    petId: z.uuid(),
  })

  const { petId } = getPetParamsSchema.parse(request.params)

  try {
    const getPetUseCase = makeGetPetUseCase()

    const { pet } = await getPetUseCase.execute({
      id: petId,
    })

    return reply.status(200).send({ pet })
  } catch (err) {
    if (err instanceof PetNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
