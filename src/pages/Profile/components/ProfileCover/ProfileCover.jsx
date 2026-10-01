import styles from "./profile-cover.module.css";
import camIcon from "../../../../assets/icons/cam-icon.png";
import { Upload } from "antd";

export default function ProfileCover({ src, onChange, disabled }) {
    return (
        <div className={styles["cover-container"]}>
            <img
                className={styles["cover-image"]}
                src={ src }
                alt="Imagem de capa de usuário"
            />

            <Upload
                name="cover"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={ onChange }
                disabled={ disabled }
            >
                <button
                    type="button"
                    disabled={ disabled }
                    className={`${styles["cover-button"]} ${disabled ? styles["disabled"] : ""}`}
                >
                    <img src={ camIcon } className={styles["button-img"]} alt="Alterar imagem de capa"/>
                </button>
            </Upload>
        </div>
    );
}