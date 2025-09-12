import { FastifyInstance } from 'fastify'

import { registerOrg } from './register'
import { authenticateOrg } from './authenticate'
import { fetchNearby } from './fetchNearby'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { adoptionsOrgHistory } from './getAdoptionHistory'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/orgs', registerOrg)
  app.post('/org/sessions', authenticateOrg)
  app.get('/orgs/nearby', fetchNearby)

  // Authenticated:
  app.get(
    '/orgs/adoptions/history',
    { onRequest: verifyJwt },
    adoptionsOrgHistory,
  )
}
