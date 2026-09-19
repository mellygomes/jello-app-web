import styles from "./profile-description.module.css";

export default function ProfileDescription({ bio }) {
    return (
        <div className={`container w-100 ${styles["description-container"]}`}>
            <h2>Descrição</h2>
            <p>{bio}</p>
        </div>
    )
}