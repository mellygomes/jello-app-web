import stylesRegister from "./register.module.css";
import styles from "../../components/AuthLayout/auth-layout.module.css";
import signInIcon from "../../assets/figma/sign-in.svg";
import userIcon from "../../assets/figma/user.svg";
import emailIcon from "../../assets/figma/email.svg";
import lockIcon from "../../assets/figma/lock.svg";
import crachaIcon from "../../assets/icons/icon-cracha-48.png";

import { AuthHeader, AuthForm, AuthInputGroup, AuthLink, AuthPage, Button, Spinner } from "../../components";
import { useRegister } from "../../hooks";

export default function Register() {

    const {
        username,
        password,
        confirmPassword,
        email,
        firstName,
        lastName,
        setUserName,
        setPassword,
        setConfirmPassword,
        setEmail,
        setFirstName,
        setLastName,
        error,
        loading,
        errorsValidate,
        submitAttempt,
        handleChange,
        handleRegister
    } = useRegister();

    return (
        <AuthPage variant="register">
            <AuthHeader
                icon={signInIcon}
                alt="Entrar"
                title="Registre-se!"
                description="Crie sua conta para publicar suas ilustrações, seguir outros artistas e ajudar a comunidade a identificar o que é arte feita por gente."
            />

            <AuthForm onSubmit={handleRegister}>

                <div className={stylesRegister["name-row"]}>
                    <AuthInputGroup
                        icon={userIcon}
                        alt="Ícone de usuário"
                        type="text"
                        name="firstName"
                        autoComplete="given-name"
                        placeholder="Nome"
                        value={firstName}
                        onChange={handleChange("firstName", setFirstName)}
                        maxLength={46}
                        errorValidate={errorsValidate.firstName}
                        shakeKey={submitAttempt}
                    />

                    <AuthInputGroup
                        icon={userIcon}
                        alt="Ícone de usuário"
                        type="text"
                        name="lastName"
                        autoComplete="family-name"
                        placeholder="Sobrenome"
                        value={lastName}
                        onChange={handleChange("lastName", setLastName)}
                        maxLength={46}
                        errorValidate={errorsValidate.lastName}
                        shakeKey={submitAttempt}
                    />
                </div>

                <AuthInputGroup
                    icon={emailIcon}
                    alt="Ícone de envelope"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="E-mail"
                    value={email}
                    maxLength={80}
                    onChange={handleChange("email", setEmail)}
                    errorValidate={errorsValidate.email}
                    shakeKey={submitAttempt}
                />

                <AuthInputGroup
                    icon={crachaIcon}
                    alt="Ícone de nome de usuário"
                    type="text"
                    name="username"
                    autoComplete="username"
                    placeholder="Nome de usuário"
                    value={username}
                    maxLength={30}
                    onChange={handleChange("username", setUserName)}
                    errorValidate={errorsValidate.username}
                    shakeKey={submitAttempt}
                />

                <div className={stylesRegister["gap"]}></div>

                <AuthInputGroup
                    icon={lockIcon}
                    alt="Ícone de cadeado"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    placeholder="Senha (mínimo 8 caracteres)"
                    value={password}
                    maxLength={72}
                    onChange={handleChange("password", setPassword)}
                    errorValidate={errorsValidate.password}
                    shakeKey={submitAttempt}
                />

                <AuthInputGroup
                    icon={lockIcon}
                    alt="Ícone de cadeado"
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    placeholder="Confirmar senha"
                    value={confirmPassword}
                    maxLength={72}
                    onChange={handleChange("confirmPassword", setConfirmPassword)}
                    errorValidate={errorsValidate.confirmPassword}
                    shakeKey={submitAttempt}
                />

                {error && <p className={stylesRegister["erro"]} role="alert">{error}</p>}

                <Button
                    type="submit"
                    variant="block"
                    className={styles["auth-button-register"]}
                    disabled={loading}
                >
                    {loading ? <><Spinner size={18} aria-hidden="true"/><span>Cadastrando...</span></>
                        : "Cadastrar"}
                </Button>

            </AuthForm>

            <AuthLink
                content="Já possui uma conta?"
                link="/login"
                anchor="Entrar"
            />
        </AuthPage>
    )
}
