import styles from '../../components/AuthLayout/auth-layout.module.css';
import loginIcon from '../../assets/icons/icon-sign-in-48.png';
import emailIcon from '../../assets/icons/icon-email-48.png';
import lockIcon from '../../assets/icons/icon-lock-48.png';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthHeader, AuthForm, AuthInputGroup, AuthLink, Button, Spinner } from '../../components';
import { useAuth } from "../../contexts/auth/useAuth.js";
import { getUserLogged, logIn } from "../../services/auth.js";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [erro, setErro] = useState("")
    const [errorsValidate, setErrorsValidate] = useState({})
    const [submitAttempt, setSubmitAttempt] = useState(0)
    const [loading, setLoading] = useState(false)


    const handleChange = (field, setter) => (event) => {
        setter(event.target.value)
        setErrorsValidate((prev) => {
        
        if (!prev[field]) return prev          
            const { [field]: _, ...rest } = prev   
            return rest
        })
    }

    const handleLogin = async (e) => {
        e.preventDefault()

        const novosErros = {}

        if (!username.trim()) novosErros.username = 'Campo obrigatório'
        if (!password.trim()) novosErros.password = 'Campo obrigatório'

        if (Object.keys(novosErros).length > 0) {
            setErrorsValidate(novosErros)
            setSubmitAttempt((n) => n + 1)   // ← força o shake
            return
        }

        setErrorsValidate({})
        setLoading(true)

        try {
            // Envia os dados de login
            await logIn({ username, password });

            // Valida o login e retorna com os dados caso estejam corretos
            const response = await getUserLogged()
            login(response.data.data);
            navigate("/");

        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.message;

            // Traduzir pro usuário
            const mensagens = {
                "Bad credentials": "Usuário ou senha inválidos",
                "User not found": "Usuário não encontrado",
            };

            const mensagemTraduzida = mensagens[message] ?? "Erro ao fazer login";
            setErro(mensagemTraduzida);

            if (status === 401) {
                setErro("Usuário ou senha inválidos");
            } else {
                setErro("Erro ao fazer login. Tente novamente.");
            }

            console.error("Erro ao fazer login:", error);

            setSubmitAttempt((n) => n + 1);   // pra ter animação de novo
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles["container"]}>
            {erro && <div key={submitAttempt} className={styles["login-error"]}>{erro}</div>}

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
                        maxLength={46}
                        onChange={handleChange('username', setUsername)}
                        errorValidate={errorsValidate.username}
                        shakeKey={submitAttempt}
                    />

                    <AuthInputGroup
                        icon={lockIcon}
                        alt={"Ícone de cadeado"}
                        type={"password"}
                        placeholder={"Senha"}
                        value={password}
                        maxLength={46}
                        onChange={handleChange('password', setPassword)}
                        errorValidate={errorsValidate.password}
                        shakeKey={submitAttempt}
                    />

                    <Button type="submit" className={styles["auth-button-register"]}>
                        {loading ? 
                            <><Spinner size={14} aria-hidden="true" /><span>Logando...</span></> 
                            : 'Login'}
                    </Button>

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