import styles from '../../components/AuthLayout/auth-layout.module.css';
import loginIcon from '../../assets/icons/icon-sign-in-48.png';
import emailIcon from '../../assets/icons/icon-email-48.png';
import lockIcon from '../../assets/icons/icon-lock-48.png';
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthHeader, AuthForm, AuthInputGroup, AuthLink, Button } from '../../components';
import { useAuth } from "../../contexts/auth/useAuth.js";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            // Envia os dados de login
            await axios.post(
                "http://localhost:8080/api/v1/auth/login",
                { username, password },
                { withCredentials: true }
            );

            // Valida o login e retorna com os dados caso estejam corretos
            const response = await axios.get(
                "http://localhost:8080/api/v1/auth/me",
                { withCredentials: true }
            );

            login(response.data.data);

            // Navega para a pagina inicial ou de perfil setada apos o login com sucesso
            navigate("/");
        } catch (error) {
            console.error("Erro ao fazer login:", error);
        }
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