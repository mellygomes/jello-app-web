import styles from '../../components/AuthLayout/auth-layout.module.css';
import loginIcon from '../../assets/figma/sign-in.svg';
import userIcon from '../../assets/figma/user.svg';
import lockIcon from '../../assets/figma/lock.svg';
import { AuthHeader, AuthForm, AuthInputGroup, AuthLink, AuthPage, Button, Spinner } from '../../components';
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
        <AuthPage variant="login">
            {error && <div key={submitAttempt} className={styles["login-error"]} role="alert">{error}</div>}

            <AuthHeader
                icon={loginIcon}
                alt={"Ícone de login"}
                title={"Bem-vindo de volta!"}
                description={"Entre na sua conta para ver o que a comunidade anda criando, votar nos posts e compartilhar suas obras."}
            />

            <AuthForm onSubmit={handleLogin}>
                <AuthInputGroup
                    icon={userIcon}
                    alt={"Ícone de usuário"}
                    type={"text"}
                    name={"username"}
                    autoComplete={"username"}
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
                    name={"password"}
                    autoComplete={"current-password"}
                    placeholder={"Senha"}
                    value={password}
                    maxLength={72}
                    onChange={handleChange('password', setPassword)}
                    errorValidate={errorsValidate.password}
                    shakeKey={submitAttempt}
                />

                <Button
                    type="submit"
                    variant="block"
                    className={styles["auth-button-register"]}
                    disabled={loading}
                >
                    {loading ?
                        <><Spinner size={18} aria-hidden="true" /><span>Entrando...</span></>
                        : 'Login'}
                </Button>
            </AuthForm>

            <AuthLink
                content={"Não possui uma conta?"}
                link={"/register"}
                anchor={"Cadastre-se"}
            />
        </AuthPage>
    )
}
