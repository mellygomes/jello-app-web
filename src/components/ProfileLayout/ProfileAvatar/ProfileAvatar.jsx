import { useRef } from "react";
import styles from "./profile-pic.module.css";
import camIcon from "../../../assets/figma/camera.png";
import Avatar from "../../Avatar";

// Foto de perfil grande com anel branco. Quando editável mostra o botão de câmera
export default function ProfileAvatar({ src, disabled, onChange, size = 180, className = "" }) {
    const inputRef = useRef(null);

    return (
        <div className={`${styles["profile-photo"]} ${className}`} style={{ "--avatar-size": `${size}px` }}>
            <Avatar src={src} name="você" size={size} />

            {!disabled && (
                <>
                    <button
                        type="button"
                        className={styles["cam-button"]}
                        onClick={() => inputRef.current?.click()}
                        aria-label="Alterar foto de perfil"
                    >
                        <img src={camIcon} alt="" width={24} height={24} />
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
