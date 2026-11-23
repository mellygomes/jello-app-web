import PostCard from "./PostCard.jsx";
import styles from "./post-list.module.css";

export default function PostList({ posts, onRemove }) {
    return (
        <div className={styles.list}>
            {posts.map((post) => <PostCard key={post.id} {...post} onRemove={onRemove} />)}
        </div>
    );
}
