import styles from '../../components/AuthLayout/auth-layout.module.css';
import loginIcon from '../../assets/icons/icon-sign-in-48.png';
import emailIcon from '../../assets/icons/icon-email-48.png';
import lockIcon from '../../assets/icons/icon-lock-48.png';
import { AuthHeader, AuthForm, AuthInputGroup, AuthLink, Button, Spinner } from '../../components';
import { useLogin } from "../../hooks";

export default function Login() {

    const {
        username,
        password,
        setUsername,
        setPassword,
        error,
        errorsValidate,
        handleLogin,
        loading,
        handleChange,
        submitAttempt
    } = useLogin();

    return (
        <div className={styles["container"]}>
            {error && <div key={submitAttempt} className={styles["login-error"]}>{error}</div>}

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
                        placeholder={"Nome de usuário"}
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