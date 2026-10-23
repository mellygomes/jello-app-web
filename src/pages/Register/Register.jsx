import stylesRegister from "./register.module.css";
import styles from "../../components/AuthLayout/auth-layout.module.css";
import signInIcon from "../../assets/icons/icon-sign-in-48.png";
import userIcon from "../../assets/icons/icon-user-30.png";
import emailIcon from "../../assets/icons/icon-email-48.png";
import lockIcon from "../../assets/icons/icon-lock-48.png";
import crachaIcon from "../../assets/icons/icon-cracha-48.png";

import { AuthHeader, AuthForm, AuthInputGroup, AuthLink, Button, Spinner } from "../../components";
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
        <div className={styles["container"]}>
            <div className={styles["auth-container"]}>

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
                        onChange={handleChange("firstName", setFirstName)}
                        maxLength={46}
                        errorValidate={errorsValidate.firstName}
                        shakeKey={submitAttempt}
                    />

                    <AuthInputGroup
                        icon={userIcon}
                        alt="Ícone de usuário"
                        type="text"
                        placeholder="Sobrenome"
                        value={lastName}
                        onChange={handleChange("lastName", setLastName)}
                        maxLength={46}
                        errorValidate={errorsValidate.lastName}
                        shakeKey={submitAttempt}
                    />

                    <AuthInputGroup
                        icon={emailIcon}
                        alt="Ícone de envelope"
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        maxLength={46}
                        onChange={handleChange("email", setEmail)}
                        errorValidate={errorsValidate.email}
                        shakeKey={submitAttempt}
                    />

                    <AuthInputGroup
                        icon={crachaIcon}
                        alt="Ícone de nome de usuário"
                        type="text"
                        placeholder="Username"
                        value={username}
                        maxLength={46}
                        onChange={handleChange("username", setUserName)}
                        errorValidate={errorsValidate.username}
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
                        onChange={handleChange("password", setPassword)}
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
                        onChange={handleChange("confirmPassword", setConfirmPassword)}
                        errorValidate={errorsValidate.confirmPassword}
                        shakeKey={submitAttempt}
                    />

                    {error && <p className={stylesRegister["erro"]}>{error}</p>}

                    <Button
                        type="submit"
                        className={styles["auth-button-register"]}
                        disabled={loading}
                    >
                        {loading ? <><Spinner size={14} aria-hidden="true"/><span>Cadastrando...</span></>
                            : "Cadastrar"}
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