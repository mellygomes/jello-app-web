import styles from "./profile-description.module.css";

export default function ProfileDescription({ value, onChange, disabled, maxLength }) {
    const length = value.length;
    const isAtLimit = maxLength && length >= maxLength;
    const isNearLimit = maxLength && length >= maxLength * 0.8;

    return (
        <div className={`container w-100 ${styles["description-container"]}`}>
                <div className={styles["label-row"]}>
                    <h2>Descrição</h2>
                    {maxLength && (
                        <span
                        className={`${styles["char-counter"]} ${
                            isAtLimit ? styles["at-limit"]
                            : isNearLimit ? styles["near-limit"]
                            : ""
                        }`}
                        >
                            {length} / {maxLength}
                        </span>
                    )}
                </div>
                <textarea
                    name="bio"
                    value={value ?? ""}
                    className={`${styles["description-textarea"]} ${disabled ? styles["disabled"] : ""}`}
                    onChange={onChange}
                    disabled={disabled}
                    maxLength={maxLength}
                    placeholder="Escreva algo sobre você..."
                    rows={4}
                    cols={170}
                />
        </div>
    )
}