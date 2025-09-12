import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { adoptionsHistory } from './getAdoptionsHistory'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // Authenticated:
  app.get(
    '/user/adoptions/history',
    { onRequest: [verifyJwt] },
    adoptionsHistory,
  )
}
