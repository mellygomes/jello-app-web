import { useState } from 'react'                                    // ← FALTAVA
import { useNavigate } from 'react-router-dom'

import stylesRegister from './register.module.css';
import styles from '../../components/AuthLayout/auth-layout.module.css';
import signInIcon from '../../assets/icons/icon-sign-in-48.png'
import userIcon from '../../assets/icons/icon-user-30.png'
import emailIcon from '../../assets/icons/icon-email-48.png'
import lockIcon from '../../assets/icons/icon-lock-48.png'

import { AuthHeader, AuthForm, AuthInputGroup, AuthLink, Button } from '../../components'
import { register } from '../../services/auth'

export default function Register() {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [firstName, setfirstName] = useState('')
  const [email, setEmail] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')       
  //   const [username, setUserName] = useState('')
  //   const [lastName, lastNameName] = useState('')
 
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setErro('')

    if (password.length < 4) {
      setErro('A senha deve ter pelo menos 4 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setErro('As senhas não coincidem')
      return
    }

    setLoading(true)

    try {
        // Criar o campo de username e lastname depois talvez, por enquanto tá essa gambiarra
        await register({ username: email, email, firstName, lastName: firstName, password })
        navigate('/login')
    } catch (error) {                                              
        setErro('Erro ao cadastrar usuário')
        console.log(error)
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className={styles['container']}>
      <div className={styles['auth-container']}>

        <AuthHeader
          icon={signInIcon}
          alt="Entrar"
          title="Registre-se!"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"
        />

        <AuthForm onSubmit={handleRegister}>

          <AuthInputGroup
            icon={userIcon}
            alt="Ícone de usuário"
            type="text"
            placeholder="Nome"
            value={firstName}
            onChange={(event) => setfirstName(event.target.value)}
          />

          <AuthInputGroup
            icon={emailIcon}
            alt="Ícone de envelope"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <div className="p-1"></div>

          <AuthInputGroup
            icon={lockIcon}
            alt="Ícone de cadeado"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <AuthInputGroup
            icon={lockIcon}
            alt="Ícone de cadeado"
            type="password"
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

            {erro && <p className={stylesRegister['erro']}>{erro}</p>}

          <Button
            type="submit"
            className={styles['auth-button-register']}
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>

        </AuthForm>

        <AuthLink
          content="Já possui uma conta?"
          link="/login"
          anchor="Entrar"
        />

      </div>
    </div>
  )
}