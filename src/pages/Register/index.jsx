// import registerStyles from './register.module.css';
import styles from '../../components/AuthLayout/AuthLayout.module.css';
import signInIcon from '../../assets/icons/icon-sign-in-48.png';
import userIcon from '../../assets/icons/icon-user-30.png';
import emailIcon from '../../assets/icons/icon-email-48.png';
import lockIcon from '../../assets/icons/icon-lock-48.png';

import {AuthHeader, AuthForm, AuthInputGroup, AuthLink, Button} from '../../components';

export default function Register() {
    return (
        <div className="container">
            <div className={styles["auth-container"]}>

                <AuthHeader
                    icon={signInIcon}
                    alt={"Entrar"}
                    title={"Registre-se!"}
                    description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"}
                />

                <AuthForm>

                    <AuthInputGroup
                        icon={userIcon}
                        alt={"Ícone de usuário"}
                        type={"text"}
                        placeholder={"Nome"}
                    />
                    <AuthInputGroup
                        icon={emailIcon}
                        alt={"Ícone de envelope"}
                        type={"email"}
                        placeholder={"E-mail"}
                    />

                    <div className="p-1"></div>

                    <AuthInputGroup
                        icon={lockIcon}
                        alt={"Ícone de cadeado"}
                        type={"password"}
                        placeholder={"Senha"}
                    />
                    <AuthInputGroup
                        icon={lockIcon}
                        alt={"Ícone de cadeado"}
                        type={"password"}
                        placeholder={"Confirmar senha"}
                    />

                    <Button type="submit">Cadastrar</Button>

                </AuthForm>

                <AuthLink
                    content={"Já possui uma conta?"}
                    link={"/login"}
                    anchor={"Entrar"}
                />

            </div>
        </div>
    )
}