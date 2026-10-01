import styles from "./profile-input.module.css";

export default function ProfileInput({id, name, label, value, type = "text" , onChange, disabled}) {
    return (
        <div className={`d-flex flex-column ${styles["profile-wrapper"]}`}>
            <label htmlFor={id} className={styles["text-label"]}>
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                value={value ?? ""}
                className={`${styles["profile-input"]} ${disabled ? styles["disabled"] : ""}`}
                onChange={onChange}
                disabled={disabled}
            />
        </div>
    );
}