import styles from "./profile-description.module.css";

// Bloco "Descrição" (editável no meu perfil) ou "Sobre" (somente leitura)
export default function ProfileDescription({ value = "", title, onChange, disabled, maxLength }) {
    const length = (value ?? "").length;
    const isAtLimit = maxLength && length >= maxLength;
    const isNearLimit = maxLength && length >= maxLength * 0.8;

    return (
        <div className={styles["description-container"]}>
            <div className={styles["label-row"]}>
                <h2>{ title }</h2>
                {maxLength && !disabled && (
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
                readOnly={disabled}
                maxLength={maxLength}
                placeholder={disabled ? "Sem descrição ainda. Clique em Editar para escrever a sua." : "Escreva algo sobre você..."}
                aria-label={title}
                rows={4}
            />
        </div>
    )
}
