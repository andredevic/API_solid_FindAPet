import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    // payload que você usa no token
    user: {
      sub: string
      role: 'ADMIN' | 'USER'
    }
  }
}
