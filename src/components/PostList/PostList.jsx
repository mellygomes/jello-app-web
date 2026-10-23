import PostCard from "./PostCard.jsx";

export default function PostList({ posts }) {
    return (
        posts.map((post) => <PostCard key={post.id} {...post} /> )
    );
}