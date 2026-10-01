import styles from "./profile-description.module.css";

export default function ProfileDescription({ value, onChange, disabled }) {
    return (
        <div className={`container w-100 ${styles["description-container"]}`}>
            <h2>Descrição</h2>
            <textarea
                name="bio"
                value={value ?? ""}
                className={`${styles["description-textarea"]} ${disabled ? styles["disabled"] : ""}`}
                onChange={onChange}
                disabled={disabled}
                placeholder="Escreva algo sobre você..."
                rows={4}
                cols={170}
            />
        </div>
    )
}