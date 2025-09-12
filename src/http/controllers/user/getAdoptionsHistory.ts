import { makeHistoryUserUseCase } from '@/use-cases/factories/make-history-user-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function adoptionsHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getHistoryAdoptionsUserUseCase = makeHistoryUserUseCase()

  const { adoptions } = await getHistoryAdoptionsUserUseCase.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({ adoptions })
}
