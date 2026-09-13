import styles from "./auth-layout.module.css";

export default function AuthInputGroup({ icon, alt, type, placeholder, value, onChange }) {
    return (
        <div className={styles["auth-input-group"]}>
            <img src={icon} alt={alt} className={styles["auth-input-icon"]}/>
            <input
                type={type}
                className={styles["auth-form-input"]}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}