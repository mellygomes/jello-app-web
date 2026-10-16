import styles from "./post-card.module.css";
import { Carousel, Tag } from "antd";
import { CommentOutlined, HeartOutlined } from "@ant-design/icons";

export default function PostCard({title, content, images = [], likes, comments, tags = []}) {
    return (
        <div className={styles.post}>
            <p>{title}</p>
            <span>{content}</span>


            <Carousel arrows>
                {images.map((image) => (
                    <div className={styles.carousel}>
                        <img className={styles.imgs} src={`http://localhost:8080` + image.url} alt=""/>
                    </div>
                ))}
            </Carousel>


            <div style={{display: "flex", gap: "8px", justifyContent: "space-between"}}>
                <div style={{ display: "flex", gap: "12px" }}>
                    <span style={{ color: "#ADADAD" }}><HeartOutlined /> {likes}</span>
                    <span style={{ color: "#ADADAD" }}><CommentOutlined /> {comments}</span>
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                    {tags.map((tag) => (
                        <Tag
                            variant={"outlined"}
                            key={tag.id}
                            color={tag.color}
                        >
                            {tag.name}
                        </Tag>
                    ))}
                </div>
            </div>
        </div>

    )
}