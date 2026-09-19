import styles from './profile-pic.module.css';

export default function ProfilePic({ src, alt }) {
    return (
        <div className={ styles["profile-photo"] }>
            <img className={ styles["photo-image"] } src={ src } alt={ alt }/>
        </div>
    );
}
