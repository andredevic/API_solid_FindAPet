import { PetAlreadyAdoptedError } from '@/use-cases/errors/pet-already-adopt-error'
import { PetNotFoundError } from '@/use-cases/errors/pet-not-found.error'
import { makeAdoptUseCase } from '@/use-cases/factories/make-adopt-pet-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function adopt(request: FastifyRequest, reply: FastifyReply) {
  const adoptPetParamsSchema = z.object({
    petId: z.string().uuid(),
  })

  const { petId } = adoptPetParamsSchema.parse(request.params)

  const userId = request.user.sub

  try {
    const adoptPetUseCase = makeAdoptUseCase()

    await adoptPetUseCase.execute({
      userId,
      petId,
    })
  } catch (err) {
    if (err instanceof PetNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    if (err instanceof PetAlreadyAdoptedError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(204).send()
}
