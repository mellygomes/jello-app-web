// import { useContext } from 'react';
// import { AuthContext } from '../contexts/auth/AuthContext';
import styles from '../../components/AuthLayout/AuthLayout.module.css';
import loginIcon from '../../assets/icons/icon-sign-in-48.png';
import emailIcon from '../../assets/icons/icon-email-48.png';
import lockIcon from '../../assets/icons/icon-lock-48.png';

import {AuthHeader, AuthForm, AuthInputGroup, AuthLink, Button} from '../../components';

export default function Login() {
    // const { login } = useContext(AuthContext)
    const handleLogin = (e) => {
        e.preventDefault()
        // Super mega logica de consumir a API mesmo
    }

    return (
        <div className="container">
            <div className={styles['auth-container']}>

                <AuthHeader
                    icon={loginIcon}
                    alt={"Ícone de login"}
                    title={"Faça Login!"}
                    description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt"}
                />

                <AuthForm onSubmit={handleLogin}>
                    <AuthInputGroup
                        icon={emailIcon}
                        alt={"Ícone de envelope"}
                        type={"email"}
                        placeholder={"E-mail"}
                    />

                    <AuthInputGroup
                        icon={lockIcon}
                        alt={"Ícone de cadeado"}
                        type={"password"}
                        placeholder={"Senha"}
                    />

                    <Button type="submit">Login</Button>
                </AuthForm>

                <AuthLink
                    content={"Não possui uma conta?"}
                    link={"/register"}
                    anchor={"Cadastre-se!"}
                />

            </div>
        </div>
    )
}