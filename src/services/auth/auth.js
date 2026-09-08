const API_URL = import.meta.env.VITE_API_URL

export async function login(data) {
  const response = await fetch(`${API_URL}/api/v1/auth/login`, {
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