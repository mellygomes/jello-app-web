import { useRef } from "react";
import styles from "./profile-cover.module.css";
import camIcon from "../../../assets/figma/camera.png";

// Capa do perfil. Quando editável mostra o botão de câmera no canto
export default function ProfileCover({ src, className = "", onChange, disabled, height }) {
    const inputRef = useRef(null);

    return (
        <div className={`${styles["cover-container"]} ${className}`} style={height ? { height } : undefined}>
            {src && (
                <img
                    className={styles["cover-image"]}
                    src={ src }
                    alt="Imagem de capa de usuário"
                />
            )}

            {!disabled && (
                <>
                    <button
                        type="button"
                        className={styles["cover-button"]}
                        onClick={() => inputRef.current?.click()}
                        aria-label="Alterar imagem de capa"
                    >
                        <img src={ camIcon } width={24} height={24} alt="" />
                    </button>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        hidden
                        onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) onChange?.({ file });
                            event.target.value = "";
                        }}
                    />
                </>
            )}
        </div>
    );
}
