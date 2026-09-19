import styles from "./profile-input.module.css";

export default function ProfileInput({ label, id, type = "text" }) {
    return (
        <div className={`d-flex flex-column ${styles["profile-wrapper"]}`}>
            <label htmlFor={id} className={styles["text-label"]}>
                {label}
            </label>
            <input id={id} type={type} className={styles["profile-input"]}/>
        </div>
    );
}