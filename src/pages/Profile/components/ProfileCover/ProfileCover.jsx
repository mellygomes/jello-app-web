import styles from "./profile-cover.module.css";

export default function ProfileCover({ src, alt }) {
    return (
        <div className={ styles["cover-container"] }>
            <img className={ styles["cover-image"] } src={ src } alt={ alt }/>
        </div>
    );
}