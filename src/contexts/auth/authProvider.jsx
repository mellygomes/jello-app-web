import { useState } from 'react'
import { AuthContext } from './authContext'
import { login as loginService } from '../../services/auth/auth'

export function AuthProvider({ children }) {
   const [user, setUser] = useState(() => {
    const username = localStorage.getItem('username')
    const token = localStorage.getItem('token')

    if (!username || !token) {
      return null
    }

    return {
      username,
      token
    }
  })

  const isAuthenticated = user !== null

  async function login(userdata) {
    const data = {
      username: userdata.username,
      password: userdata.password
    }

    const response = await loginService(data)

    localStorage.setItem('token', response.data.token)
    localStorage.setItem('username', userdata.username)
    localStorage.setItem('email', userdata.email)

    setUser({
      username: userdata.username,
      email: userdata.email,
      token: response.token
    })
  }


  function logout() {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}