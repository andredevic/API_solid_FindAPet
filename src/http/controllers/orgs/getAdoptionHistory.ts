import { makeHistoryOrgUseCase } from '@/use-cases/factories/make-history-org-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function adoptionsOrgHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getHistoryAdoptionsOrgUseCase = makeHistoryOrgUseCase()

  const { adoptions } = await getHistoryAdoptionsOrgUseCase.execute({
    orgId: request.user.sub,
  })

  return reply.status(200).send({ adoptions })
}
