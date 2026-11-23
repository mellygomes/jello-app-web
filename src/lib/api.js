// Instancia a axios e define a URL do back

import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

export const API_URL = import.meta.env.VITE_API_URL

// Pega a mensagem de erro que o back mandou (ProblemDetail) ou usa uma padrão
export function getErrorMessage(error, fallback = "Algo deu errado. Tente novamente.") {
  const data = error?.response?.data
  return data?.detail || data?.message || fallback
}
