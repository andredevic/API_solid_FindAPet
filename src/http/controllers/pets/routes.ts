import { FastifyInstance } from 'fastify'
import { createPet } from './create'
import { adopt } from './adopt'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { search } from './search'
import { get } from './list'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets/search', search)
  app.get('/pets/:petId', get)

  // Authenticated:
  app.post('/pets', { onRequest: [verifyJwt] }, createPet)
  app.post('/pets/:petId/adopt', { onRequest: [verifyJwt] }, adopt)
}
