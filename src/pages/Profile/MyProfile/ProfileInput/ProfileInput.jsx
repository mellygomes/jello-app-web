import styles from "./profile-input.module.css";

export default function ProfileInput({
        id,
        name, 
        label,
        value, 
        type = "text", 
        onChange, 
        disabled, 
        errorValidate, 
        shakeKey, 
        maxLength
    }) {

        const length = value.length;
        const isAtLimit = maxLength && length >= maxLength;
        const isNearLimit = maxLength && length >= maxLength * 0.8;

    return (
        <div className={`d-flex flex-column ${styles["profile-wrapper"]}`}>
            <div key={shakeKey} className={styles["profile-wrapper-group"]}>

                <div className={styles["label-row"]}>
                    <label htmlFor={id} className={styles["text-label"]}>
                        {label}
                    </label>

                    {maxLength && (
                        <span
                            className={`${styles["char-counter"]} ${
                                isAtLimit ? styles["at-limit"]
                                : isNearLimit ? styles["near-limit"]
                                : ""
                            }`}
                            >
                            {length}/{maxLength}
                        </span>
                    )}
                </div>

                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value ?? ""}
                    maxLength={maxLength}
                    className={`${styles["profile-input"]} ${disabled ? styles["disabled"] : ""} ${errorValidate ? styles["error"] : ""}`}
                    onChange={onChange}
                    disabled={disabled}
                />

            </div>
            {errorValidate && (<p className={styles["error-message"]}>{errorValidate}</p>)}
        </div>
    );
}