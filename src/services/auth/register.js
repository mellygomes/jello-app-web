const API_URL = import.meta.env.VITE_API_URL

export async function register(data) {
  const response = await fetch(`${API_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

    if (!response.ok) {
        throw new Error('Erro ao cadastrar usuário')
    }

    return response.json()
}