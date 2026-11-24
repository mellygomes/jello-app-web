import { useId, useState } from "react";
import eyeClosed from "../../assets/figma/eye-closed.svg";
import eyeOpen from "../../assets/figma/eye-open.svg";
import styles from "./password-field.module.css";

// Campo de senha com olhinho pra mostrar/ocultar (versão clara, usada fora do login)
export default function PasswordField({ label, value, onChange, error, autoComplete, maxLength = 72 }) {
    const id = useId();
    const [visible, setVisible] = useState(false);

    return (
        <div className={styles.field}>
            <label htmlFor={id}>{label}</label>
            <div className={`${styles.box} ${error ? styles.error : ""}`}>
                <input
                    id={id}
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    maxLength={maxLength}
                    aria-invalid={Boolean(error)}
                />
                <button
                    type="button"
                    onClick={() => setVisible((prev) => !prev)}
                    aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
                    aria-pressed={visible}
                >
                    <img src={visible ? eyeOpen : eyeClosed} alt="" width={24} height={24} />
                </button>
            </div>
            {error && <p role="alert">{error}</p>}
        </div>
    );
}
