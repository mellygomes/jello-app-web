import styles from './profile-header.module.css';

export default function ProfileHeader({ name, followers, following, posts }) {
    return (
        <div>
            <h1>{ name }</h1>
            <div className={styles["header-stats"]}>
                <span>{ followers }</span>
                <span className={styles["dot"]}></span>
                <span>{ following }</span>
                <span className={styles["dot"]}></span>
                <span>{ posts }</span>
            </div>
        </div>
    )
}