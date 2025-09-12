import fastify from 'fastify'
import { userRoutes } from './http/controllers/user/routes'
import fastifyJwt from '@fastify/jwt'
import { env } from './env'
import { orgsRoutes } from './http/controllers/orgs/routes'
import { petsRoutes } from './http/controllers/pets/routes'
import { ZodError, z } from 'zod'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(userRoutes)
app.register(orgsRoutes)
app.register(petsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: z.treeifyError(error) })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
