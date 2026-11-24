import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "../../services";
import styles from "./image-carousel.module.css";

// Carrossel de imagens do post (setas + bolinhas)
export default function ImageCarousel({ images = [], alt = "Imagem do post" }) {
    const [index, setIndex] = useState(0);

    if (images.length === 0) return null;

    const total = images.length;
    const go = (step) => setIndex((current) => (current + step + total) % total);

    return (
        <div className={styles.carousel}>
            <img
                className={styles.image}
                src={getImageUrl(images[index].url)}
                alt={`${alt} ${index + 1} de ${total}`}
                loading="lazy"
            />

            {total > 1 && (
                <>
                    <button type="button" className={`${styles.arrow} ${styles.left}`} onClick={() => go(-1)} aria-label="Imagem anterior">
                        <ChevronLeft size={22} />
                    </button>
                    <button type="button" className={`${styles.arrow} ${styles.right}`} onClick={() => go(1)} aria-label="Próxima imagem">
                        <ChevronRight size={22} />
                    </button>

                    <div className={styles.dots}>
                        {images.map((image, position) => (
                            <button
                                type="button"
                                key={image.id ?? position}
                                className={position === index ? styles.dotActive : styles.dot}
                                onClick={() => setIndex(position)}
                                aria-label={`Ir para imagem ${position + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
