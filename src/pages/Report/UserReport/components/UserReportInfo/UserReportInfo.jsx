import styles from "./user-report-info.module.css";
import { Button } from "../../../../../components/index.js";
import { useNavigate } from "react-router-dom";

export default function UserReportInfo({ name, username, bio, email, userId }) {

    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <span className={styles.label}>Nome</span>
                <span>{ name }</span>
            </div>

            <div className={styles.wrapper}>
                <span className={styles.label}>Nome de Usuário</span>
                <span>{ username }</span>
            </div>

            <div className={styles.wrapper}>
                <span className={styles.label}>E-mail</span>
                <span>{ email }</span>
            </div>

            <div className={styles.wrapper}>
                <span className={styles.label}>Biografia</span>
                <span>{ bio }</span>
            </div>

            <div className={styles.link}>
                <Button onClick={() =>  navigate(`/user-profile/${userId}`)} >Ver perfil</Button>
            </div>
        </div>
    );
}
