import {useContext} from 'react';
import {AuthContext} from '../../contexts/auth/AuthContext';
import styles from '../../components/AuthLayout/auth-layout.module.css';
import loginIcon from '../../assets/icons/icon-sign-in-48.png';
import emailIcon from '../../assets/icons/icon-email-48.png';
import lockIcon from '../../assets/icons/icon-lock-48.png';
import {useNavigate} from "react-router-dom";

import {AuthHeader, AuthForm, AuthInputGroup, AuthLink, Button} from '../../components';

import {useState} from "react";
import axios from "axios";

export default function Login() {
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault()

        const response = await axios.post("http://localhost:8080/api/v1/auth/login", {
            username,
            password
        });

        // Token do usuario salvo no localStorage pra manter login ativo por enquanto
        const token = response.data.data.token;
        localStorage.setItem("token", token);

        login(response.data);

        navigate("/");
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
                        type={"text"}
                        placeholder={"E-mail"}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <AuthInputGroup
                        icon={lockIcon}
                        alt={"Ícone de cadeado"}
                        type={"password"}
                        placeholder={"Senha"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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