import { FastifyInstance } from 'fastify'

import { registerOrg } from './register'
import { authenticateOrg } from './authenticate'
import { fetchNearby } from './fetchNearby'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { adoptionsOrgHistory } from './getAdoptionHistory'
import { refresh } from './refresh'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/org/sessions', authenticateOrg)
  app.get('/orgs/nearby', fetchNearby)
  app.patch('/orgs/token/refresh', refresh)

  app.post(
    '/orgs',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
    },
    registerOrg,
  )

  // Authenticated:
  app.get(
    '/orgs/adoptions/history',
    { onRequest: verifyJwt },
    adoptionsOrgHistory,
  )
}
