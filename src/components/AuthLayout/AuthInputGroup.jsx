import styles from "./AuthLayout.module.css";

export default function AuthInputGroup({icon, alt, type, placeholder}) {
    return (
        <div className={styles["auth-input-group"]}>
            <img src={icon} alt={alt} className={styles["auth-input-icon"]}/>
            <input type={type} className={styles["auth-form-input"]} placeholder={placeholder}/>
        </div>
    )
}