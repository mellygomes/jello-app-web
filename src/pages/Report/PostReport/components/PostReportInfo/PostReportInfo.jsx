import styles from "./post-report-info.module.css";
import { Carousel } from "antd";

export default function PostReportInfo({ title, content, images = [] }) {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <span className={styles.title}>Título</span>
                { title }
            </div>

            <div className={styles.wrapper}>
                <span className={styles.title}>Conteúdo</span>
                { content }
            </div>

            <div className={styles.wrapper}>
                <span className={styles.title}>Imagens</span>
                <Carousel
                    arrows
                    dots={{ className: "meu-dots" }}
                    className={styles.carousel}

                >
                    { images.map((image) => (
                        <div className={styles.img}>
                            <img src={`${import.meta.env.VITE_API_URL}${image.url}`} alt=""/>
                        </div>
                    )) }
                </Carousel>
            </div>
        </div>
    );
}
