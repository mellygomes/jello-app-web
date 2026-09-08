import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './register.css'
import {signInIcon, userIcon, emailIcon, lockIcon} from '../../assets/icons/index.js'
import { register } from '../../services/auth/register'
import Button from '../../components/Button/button.jsx'

import { AuthContext } from '../../contexts/auth/authContext.jsx'

export default function Register() {

  const { login } = useContext(AuthContext)

  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()

    const data = {
      firstName: userName,
      lastName: userName,
      username: userName,
      email: email,
      password: password
    }

    try {
      const response = await register(data)
      console.log(response)

      await login(data)

      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='container'>

      <div className="register-card">
        <img src={signInIcon} alt="Entrar" className='icon-sign-in'/>

        <p className="title">Registre-se</p>

        <p className="sub">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt
        </p>

      <div className='mb-5'>
        <form onSubmit={handleSubmit}>

            <div className="input-group">
              <img src={userIcon} alt="" className="input-icon" />
              <input 
                type="text" className="form-input" placeholder="Usuário" 
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
              />
            </div>

            <div className="input-group">
              <img src={emailIcon} alt="" className="input-icon" />
              <input 
                type="email" className="form-input" placeholder="E-mail"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                />
            </div>

            <div className='p-1'></div>

            <div className="input-group">
              <img src={lockIcon} alt="" className="input-icon" />
              <input type="password" className="form-input" placeholder="Senha"/>
            </div>

            <div className="input-group">
              <img src={lockIcon} alt="" className="input-icon" />
              <input 
                type="password" className="form-input" placeholder="Confirmar senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className='p-3'></div>

            <div className='button-register'><Button type="submit">Cadastrar</Button></div>

        </form>
      </div>

      <p className='login-link '> Já possui uma conta?<a href="/">Entrar</a></p>

      </div>
    </div>
  )
}