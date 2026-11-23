import { Link } from "react-router-dom";
import { Bot, Flame, Heart, MessageCircle, ShieldCheck } from "lucide-react";
import Avatar from "../Avatar";
import FollowButton from "../FollowButton";
import AiVotePanel from "../PostList/AiVotePanel.jsx";
import { getImageUrl } from "../../services";
import { compactNumber } from "../../utils/time.js";
import styles from "./showcase.module.css";

const cover = (post) => (post.images?.[0] ? getImageUrl(post.images[0].url) : "");

// Título + subtítulo de uma faixa da vitrine
export function ShowcaseSection({ icon, title, subtitle, children }) {
    return (
        <section className={styles.section} aria-label={title}>
            <header className={styles["section-head"]}>
                <h2>{icon}{title}</h2>
                {subtitle && <p>{subtitle}</p>}
            </header>
            {children}
        </section>
    );
}

// Faixa "Em alta esta semana": posts mais curtidos, com número de ranking
export function TrendingStrip({ posts, onOpen }) {
    if (posts.length === 0) return null;

    return (
        <ShowcaseSection
            icon={<Flame size={24} aria-hidden="true" />}
            title="Em alta esta semana"
            subtitle="As obras mais curtidas dos últimos 7 dias."
        >
            <ol className={styles.strip}>
                {posts.map((post, index) => (
                    <li key={post.id}>
                        <button type="button" className={styles.trend} onClick={() => onOpen(posts, index)} aria-label={`Abrir ${post.title}`}>
                            <img src={cover(post)} alt="" loading="lazy" />
                            <span className={styles.rank}>{index + 1}</span>
                            <span className={styles["trend-info"]}>
                                <strong>{post.title}</strong>
                                <small><Heart size={13} aria-hidden="true" /> {compactNumber(post.likes)} <MessageCircle size={13} aria-hidden="true" /> {compactNumber(post.comments)}</small>
                            </span>
                        </button>
                    </li>
                ))}
            </ol>
        </ShowcaseSection>
    );
}

// Cartões coloridos das tags, com uma prévia tirada de um post de cada estilo
export function StyleShelf({ tags, pool, onPick }) {
    if (tags.length === 0) return null;

    const preview = (tagId) => {
        const post = pool.find((item) => item.tags?.some((tag) => tag.id === tagId) && item.images?.length);
        return post ? cover(post) : "";
    };

    return (
        <ShowcaseSection title="Explorar por estilo" subtitle="Escolha uma tag e veja só aquele tipo de arte.">
            <ul className={styles.strip}>
                {tags.map((tag) => {
                    const image = preview(tag.id);
                    return (
                        <li key={tag.id}>
                            <button
                                type="button"
                                className={styles.style}
                                style={{ "--tag-color": tag.color }}
                                onClick={() => onPick(tag.id)}
                            >
                                {image && <img src={image} alt="" loading="lazy" />}
                                <span>{tag.name}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </ShowcaseSection>
    );
}

// Artistas sugeridos, cada um com as obras mais novas
export function ArtistShelf({ artists, onOpen }) {
    if (artists.length === 0) return null;

    return (
        <ShowcaseSection title="Artistas para conhecer" subtitle="Gente que você ainda não segue.">
            <ul className={styles.strip}>
                {artists.map((artist) => {
                    const name = `${artist.firstName ?? ""} ${artist.lastName ?? ""}`.trim();
                    return (
                        <li key={artist.id} className={styles.artist}>
                            <div className={styles["artist-top"]}>
                                <Avatar avatarId={artist.avatarId} name={name} size={54} to={`/user-profile/${artist.id}`} />
                                <Link to={`/user-profile/${artist.id}`} className={styles["artist-name"]}>
                                    <strong>{name}{artist.moderator && <ShieldCheck size={15} aria-label="Moderador" />}</strong>
                                    <span>@{artist.username}</span>
                                </Link>
                            </div>
                            <div className={styles.works}>
                                {artist.works.map((work, index) => (
                                    <button key={work.id} type="button" onClick={() => onOpen(artist.works, index)} aria-label={`Abrir ${work.title}`}>
                                        <img src={cover(work)} alt="" loading="lazy" />
                                    </button>
                                ))}
                            </div>
                            <FollowButton userId={artist.id} following={artist.following} />
                        </li>
                    );
                })}
            </ul>
        </ShowcaseSection>
    );
}

// "Ajude a comunidade": posts ainda sem veredito pedindo o seu voto
export function CommunityHelp({ posts, onOpen, onVote }) {
    if (posts.length === 0) return null;

    return (
        <ShowcaseSection
            icon={<Bot size={24} aria-hidden="true" />}
            title="Ajude a comunidade"
            subtitle="Essas obras ainda não têm veredito. Você acha que são feitas por gente ou por I.A.?"
        >
            <ul className={styles.strip}>
                {posts.map((post, index) => (
                    <li key={post.id} className={styles.help}>
                        <button type="button" onClick={() => onOpen(posts, index)} aria-label={`Abrir ${post.title}`}>
                            <img src={cover(post)} alt="" loading="lazy" />
                        </button>
                        <strong>{post.title}</strong>
                        <AiVotePanel postId={post.id} votes={post.aiVotes} onChange={(votes) => onVote(post.id, votes)} />
                    </li>
                ))}
            </ul>
        </ShowcaseSection>
    );
}

// Mural: imagens em colunas, sem cortar. Passar o mouse mostra título e números.
export function MasonryGrid({ posts, onOpen }) {
    return (
        <ul className={styles.masonry}>
            {posts.map((post, index) => (
                <li key={post.id}>
                    <button type="button" className={styles.tile} onClick={() => onOpen(posts, index)} aria-label={`Abrir ${post.title}`}>
                        <img src={cover(post)} alt={post.title} loading="lazy" />
                        {post.classification === "AI" && <span className={`${styles.badge} ${styles.ai}`}>I.A.</span>}
                        {post.classification === "HUMAN" && <span className={`${styles.badge} ${styles.human}`}>Arte humana</span>}
                        <span className={styles.caption}>
                            <strong>{post.title}</strong>
                            <small>
                                {post.author?.firstName} · <Heart size={12} aria-hidden="true" /> {compactNumber(post.likes)} · <MessageCircle size={12} aria-hidden="true" /> {compactNumber(post.comments)}
                            </small>
                        </span>
                    </button>
                </li>
            ))}
        </ul>
    );
}
