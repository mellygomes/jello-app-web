import { useState } from 'react'                                    
import { useNavigate } from 'react-router-dom'

import stylesRegister from './register.module.css';
import styles from '../../components/AuthLayout/auth-layout.module.css';
import signInIcon from '../../assets/icons/icon-sign-in-48.png'
import userIcon from '../../assets/icons/icon-user-30.png'
import emailIcon from '../../assets/icons/icon-email-48.png'
import lockIcon from '../../assets/icons/icon-lock-48.png'

import { AuthHeader, AuthForm, AuthInputGroup, AuthLink, Button, Spinner } from '../../components'
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
  const [errorsValidate, setErrorsValidate] = useState({})
  const [submitAttempt, setSubmitAttempt] = useState(0)

  const handleChange = (field, setter) => (event) => {
    setter(event.target.value)
    setErrorsValidate((prev) => {
      
      if (!prev[field]) return prev          
        const { [field]: _, ...rest } = prev   
        return rest
      })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setErro('')

    const novosErros = {}

    if (!firstName.trim()) novosErros.firstName = 'Campo obrigatório'
    if (!email.trim())     novosErros.email = 'Campo obrigatório'
    
    if (!password) {
      novosErros.password = 'Campo obrigatório'
    } else if (password.length < 4) {
      novosErros.password = 'A senha deve ter pelo menos 4 caracteres'
    }

    if (password !== confirmPassword) {
      novosErros.confirmPassword = 'As senhas não coincidem'
    }

    if (Object.keys(novosErros).length > 0) {
      setErrorsValidate(novosErros)
      setSubmitAttempt((n) => n + 1)   // ← força o shake
      return
    }

    setErrorsValidate({})
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
            onChange={handleChange('firstName', setfirstName)}
            maxLength={46}
            errorValidate={errorsValidate.firstName}
            shakeKey={submitAttempt}
          />

          <AuthInputGroup
            icon={emailIcon}
            alt="Ícone de envelope"
            type="email"
            placeholder="E-mail"
            value={email}
            maxLength={46}
            onChange={handleChange('email', setEmail)}
            errorValidate={errorsValidate.email}
            shakeKey={submitAttempt} 
          />

          <div className="p-1"></div>

          <AuthInputGroup
            icon={lockIcon}
            alt="Ícone de cadeado"
            type="password"
            placeholder="Senha"
            value={password}
            maxLength={46}
            onChange={handleChange('password', setPassword)}
            errorValidate={errorsValidate.password}
            shakeKey={submitAttempt}  
          />

          <AuthInputGroup
            icon={lockIcon}
            alt="Ícone de cadeado"
            type="password"
            placeholder="Confirmar senha"
            value={confirmPassword}
            maxLength={46}
            onChange={handleChange('confirmPassword', setConfirmPassword)}
            errorValidate={errorsValidate.confirmPassword}
            shakeKey={submitAttempt}  
          />

            {erro && <p className={stylesRegister['erro']}>{erro}</p>}

          <Button
            type="submit"
            className={styles['auth-button-register']}
            disabled={loading}
          >
            {loading  ? <><Spinner size={14} aria-hidden="true" /><span>Cadastrando...</span></> 
                      : 'Cadastrar'}
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