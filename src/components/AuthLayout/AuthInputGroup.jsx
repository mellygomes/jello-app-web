import { useState } from "react";
import styles from "./auth-layout.module.css";
import eyeClosed from "../../assets/figma/eye-closed.svg";
import eyeOpen from "../../assets/figma/eye-open.svg";

export default function AuthInputGroup({
    icon,
    alt,
    type,
    placeholder,
    value,
    onChange,
    errorValidate,
    shakeKey,
    maxLength,
    name,
    autoComplete
  }) {

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={styles["auth-field"]}>

      <div key={shakeKey} className={`${styles["auth-input-group"]} ${errorValidate ? styles["error"] : ""}`}>

        <img src={icon} alt={alt} className={styles["auth-input-icon"]} />
        <input
          type={isPassword && showPassword ? "text" : type}
          className={styles["auth-form-input"]}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-invalid={Boolean(errorValidate)}
          name={name}
          autoComplete={autoComplete}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
        />

        {isPassword && (
          <button
            type="button"
            className={styles["eye-button"]}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={showPassword}
            title={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            <img src={showPassword ? eyeOpen : eyeClosed} alt="" />
          </button>
        )}
      </div>

      {errorValidate && (<p className={styles["error-message"]} role="alert">{errorValidate}</p>)}
    </div>
  );
}
