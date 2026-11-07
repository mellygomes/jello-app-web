import { useEffect, useState } from 'react';
import styles from './feed.module.css';
import SideBar from './components/SideBar/SideBar';
import Posts from './components/Posts/Posts';
import { getFeedPosts } from '../../services/feed.js';

function extractPosts(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.content)) return data.data.content;
    return [];
}

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;

        async function loadPosts() {
            try {
                const response = await getFeedPosts();
                if (!cancelled) {
                    const loadedPosts = extractPosts(response.data);
                    setPosts(loadedPosts);
                }
            } catch (requestError) {
                console.error('Erro ao carregar o feed:', requestError);
                if (!cancelled) setError('Não foi possível carregar as publicações.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadPosts();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className={styles['page-wrapper']}>
            <SideBar />
            <main className={styles['posts-wrapper']}>
                <h1>Início</h1>
                {loading && <p role="status">Carregando publicações...</p>}
                {!loading && error && <p role="alert">{error}</p>}
                {!loading && !error && posts.length === 0 && (
                    <p>Nenhuma publicação encontrada.</p>
                )}
                {!error && posts.map((post) => (
                    <Posts
                        key={post.id}
                        post={post}
                    />
                ))}
            </main>
        </div>
    );
}
