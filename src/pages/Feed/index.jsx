import PostFeed from "../../components/PostFeed";
import { getFeedPosts } from "../../services";

// Início: posts da rede (mais recentes primeiro) com a caixa de criar post no topo
export default function Feed() {
    return (
        <PostFeed
            title="Início"
            fetcher={getFeedPosts}
            composer
            endMessage="Você viu tudo por enquanto."
        />
    );
}
