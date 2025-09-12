import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeRegisterUserUseCase } from '@/use-cases/factories/make-register-user-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    phone: z.string(),
    password: z.string().min(6),
  })

  const { name, email, password, phone } = registerBodySchema.parse(
    request.body,
  )

  try {
    const registerUseCase = makeRegisterUserUseCase()

    await registerUseCase.execute({
      name,
      email,
      password,
      phone,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    throw err
  }

  return reply.status(201).send()
}
