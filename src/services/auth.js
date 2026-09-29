import { api } from '../lib/api'

export async function register(data) {
  const response = await api.post('/api/v1/auth/register', data)
  return response.data
}