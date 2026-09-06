import './register.css'
import signInIcon from '../../assets/icons/icon-sign-in-48.png'
import userIcon from '../../assets/icons/icon-user-30.png'
import emailIcon from '../../assets/icons/icon-email-48.png'
import lockIcon from '../../assets/icons/icon-lock-48.png'
import Button from '../../components/Button/button.jsx'

export default function Register() {
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
        <form action="">

            <div className="input-group">
              <img src={userIcon} alt="" className="input-icon" />
              <input type="text" className="form-input" placeholder="Nome"/>
            </div>

            <div className="input-group">
              <img src={emailIcon} alt="" className="input-icon" />
              <input type="email" className="form-input" placeholder="E-mail"/>
            </div>

            <div className='p-1'></div>

            <div className="input-group">
              <img src={lockIcon} alt="" className="input-icon" />
              <input type="password" className="form-input" placeholder="Senha"/>
            </div>

            <div className="input-group">
              <img src={lockIcon} alt="" className="input-icon" />
              <input type="password" className="form-input" placeholder="Confirmar senha"/>
            </div>

            <div className='p-3'></div>

            <div className='button-register'><Button>Cadastrar</Button></div>

        </form>
      </div>

      <p className='login-link '> Já possui uma conta?<a href="/">Entrar</a></p>

      </div>
    </div>
  )
}