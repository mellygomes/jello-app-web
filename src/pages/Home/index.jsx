import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth/authContext.jsx'
import Button from '../../components/Button/button.jsx'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  
  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div>
      <h2>Home aqui!</h2>

      {user && (
        <>
          <p>Olá, {user.username}!</p>

          <Button type="button" onClick={handleLogout}>
            Logout
          </Button>
        </>
      )}
    </div>
  )
}