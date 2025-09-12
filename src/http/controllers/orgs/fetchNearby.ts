import { makeFetchNearbyUseCase } from '@/use-cases/factories/make-fetch-nearby-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function fetchNearby(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchNearbyOrgsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = fetchNearbyOrgsQuerySchema.parse(
    request.query,
  )

  const fetchNearbyOrgsUseCase = makeFetchNearbyUseCase()

  const { orgs } = await fetchNearbyOrgsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({ orgs })
}
