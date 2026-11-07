import { useState } from 'react';
import { CommentOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import styles from './posts.module.css';
import iconUser from '../../../../assets/icons/icon-user-30.png';
import Button from '../../../../components/Button/Button';
import { getAvatarUrl, likePost, unlikePost } from '../../../../services/feed.js';

function getImageUrl(url) {
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL || ''}${url}`;
}

export default function Posts({ post }) {
    const user = post.user;
    const authorName = user
        ? [user.firstName, user.lastName]
        : 'Usuário';
    const avatarUrl = user?.avatar?.url
        || getAvatarUrl(user?.avatar?.id)
        || iconUser;
    const images = post.images || [];

    const [liked, setLiked] = useState(post.isLiked ?? false);
    const [likes, setLikes] = useState(post.likes || 0);
    const [likePending, setLikePending] = useState(false);
    const [likeError, setLikeError] = useState('');

    async function handleLike() {
        if (likePending) return;

        setLikePending(true);
        setLikeError('');
        try {
            if (liked) {
                await unlikePost(post.id);
                setLikes(Math.max(likes - 1, 0));
            } else {
                await likePost(post.id);
                setLikes(likes + 1);
            }
            setLiked(!liked);
        } catch (error) {
            console.error('Erro ao atualizar curtida:', error);
            setLikeError('Não foi possível atualizar a curtida.');
        } finally {
            setLikePending(false);
        }
    }

    return (
        <article className={styles['posts-container']}>
            <header className={styles['user-profile']}>
                <img
                    src={avatarUrl}
                    alt={`Foto de perfil de ${authorName}`}
                    className={styles.avatar}
                />
                <div className={styles['post-info']}>
                    <p className={styles.username}>{authorName}</p>
                </div>
                <Button className={styles['follow-button']}>Seguir</Button>
            </header>

            {post.title && <h2 className={styles.title}>{post.title}</h2>}
            {post.content && <p className={styles.content}>{post.content}</p>}

            {images.length > 0 && (
                <div className={styles.images}>
                    {images.map((image) => (
                        <img
                            key={image.id}
                            src={getImageUrl(image.url)}
                            alt={`Imagem da publicação de ${authorName}`}
                            className={styles['post-image']}
                        />
                    ))}
                </div>
            )}

            <footer className={styles['post-actions']} aria-label="Interações da publicação">
                <button
                    type="button"
                    className={liked ? styles['like-button-active'] : styles['like-button']}
                    onClick={handleLike}
                    disabled={likePending}
                    aria-label={liked ? 'Remover curtida' : 'Curtir publicação'}
                    aria-pressed={liked}
                >
                    {liked ? <HeartFilled /> : <HeartOutlined />} {likes}
                </button>
                <span><CommentOutlined /> {post.comments || 0}</span>
            </footer>
            {likeError && <p className={styles['like-error']} role="alert">{likeError}</p>}
        </article>
    );
}
