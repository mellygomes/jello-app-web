import { useEffect, useState } from 'react';
import styles from './feed.module.css';
import SideBar from './components/SideBar/SideBar';
import Posts from './components/Posts/Posts';
import { getFeedPosts } from '../../services/feed.js';

const PAGE_SIZE = 20;

function extractPosts(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.content)) return data.data.content;
    return [];
}

function extractTotalPages(data) {
    return data?.totalPages
        ?? data?.data?.totalPages
        ?? data?.data?.page?.totalPages
        ?? null;
}

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        let cancelled = false;

        async function loadPosts() {
            try {
                const loadedPosts = [];
                const loadedPostIds = new Set();
                let page = 0;
                let totalPages = null;

                do {
                    const response = await getFeedPosts(page, PAGE_SIZE);
                    const pagePosts = extractPosts(response.data);
                    totalPages = extractTotalPages(response.data);

                    if (
                        page > 0
                        && pagePosts.length > 0
                        && pagePosts.every((post) => post.id != null && loadedPostIds.has(post.id))
                    ) {
                        break;
                    }

                    pagePosts.forEach((post) => {
                        if (post.id != null) loadedPostIds.add(post.id);
                    });
                    loadedPosts.push(...pagePosts);
                    page += 1;

                    if (totalPages == null && pagePosts.length < PAGE_SIZE) break;
                } while (totalPages == null || page < totalPages);

                if (cancelled) return;
                setPosts(loadedPosts.reverse());
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
                {loading && (
                    <p className={styles['feed-message']} role="status">
                        Carregando publicações...
                    </p>
                )}
                {!loading && error && (
                    <p className={`${styles['feed-message']} ${styles['feed-error']}`} role="alert">
                        {error}
                    </p>
                )}
                {!loading && !error && posts.length === 0 && (
                    <p className={styles['feed-message']}>Nenhuma publicação encontrada.</p>
                )}
                {!error && posts.length > 0 && (
                    <section className={styles['posts-list']} aria-label="Publicações">
                        {posts.map((post) => (
                            <Posts
                                key={post.id}
                                post={post}
                            />
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
}
