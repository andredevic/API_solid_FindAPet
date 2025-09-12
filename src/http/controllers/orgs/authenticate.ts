import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeAuthenticateOrgUseCase } from '@/use-cases/factories/make-authenticate-org-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function authenticateOrg(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateOrgBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateOrgBodySchema.parse(request.body)

  try {
    const authenticateOrgUseCase = makeAuthenticateOrgUseCase()

    const { org } = await authenticateOrgUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: org.id,
        },
      },
    )

    return reply.status(200).send({
      token,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(400).send({ message: err.message })
    }
    throw err
  }
}
