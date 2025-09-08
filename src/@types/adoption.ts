export interface AdoptionWithPetAndUser {
  id: string
  user_id: string
  pet_id: string
  user: {
    id: string
    name: string
    email: string
    password_hash: string
    phone: string
    created_at: Date
  }
  pet: {
    id: string
    name: string
    description: string
    age: string
    size: string
    energy_level: string
    environment: string
    org_id: string
    org: {
      id: string
      name: string
      author_name: string
      email: string
      whatsapp: string
    }
  }
}
