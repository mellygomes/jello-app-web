import styles from "./auth-layout.module.css";

export default function AuthInputGroup({
    icon, 
    alt, 
    type, 
    placeholder, 
    value, 
    onChange,
    errorValidate, 
    shakeKey,
    maxLength
  }) {
  return (
    <div className={styles["auth-field"]}>

      <div key={shakeKey} className={`${styles["auth-input-group"]} ${errorValidate ? styles["error"] : ""}`}>

        <img src={icon} alt={alt} className={styles["auth-input-icon"]} />
        <input
          type={type}
          className={styles["auth-form-input"]}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
        />
      </div>

      {errorValidate && (<p className={styles["error-message"]}>{errorValidate}</p>)}
    </div>
  );
}