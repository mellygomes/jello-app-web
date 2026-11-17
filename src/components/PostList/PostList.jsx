import PostCard from "./PostCard.jsx";

export default function PostList({ posts }) {
    console.log("tome post", posts);
    return (
        posts.map((post) => <PostCard key={post.id} {...post} /> )
);
}