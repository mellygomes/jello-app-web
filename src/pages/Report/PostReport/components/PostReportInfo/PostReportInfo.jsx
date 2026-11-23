import styles from "./post-report-info.module.css";
import ImageCarousel from "../../../../../components/PostList/ImageCarousel.jsx";

export default function PostReportInfo({ title, content, images = [] }) {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <span className={styles.title}>Título</span>
                <span>{ title }</span>
            </div>

            <div className={styles.wrapper}>
                <span className={styles.title}>Conteúdo</span>
                <span>{ content || "Sem descrição." }</span>
            </div>

            <div className={styles.wrapper}>
                <span className={styles.title}>Imagens</span>
                <ImageCarousel images={images} alt={title} />
            </div>
        </div>
    );
}
