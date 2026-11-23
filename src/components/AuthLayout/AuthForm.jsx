import styles from "./auth-layout.module.css";

export default function AuthForm({ children, onSubmit }) {
    return (
        <form onSubmit={onSubmit} className={styles["auth-form"]} noValidate>
            {children}
        </form>
    )
}
