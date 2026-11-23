import { useState } from "react";
import { Link } from "react-router-dom";
import { Bot, Heart, Palette, ShieldCheck } from "lucide-react";
import styles from "./post-card.module.css";
import commentIcon from "../../assets/figma/comment.svg";
import Avatar from "../Avatar";
import FollowButton from "../FollowButton";
import ReportOptions from "../ReportOptions";
import CommentsDialog from "../Comments";
import ImageCarousel from "./ImageCarousel.jsx";
import AiVotePanel from "./AiVotePanel.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useFollowState } from "../../hooks/useFollowState.js";
import { likePost, unbanPost, unlikePost } from "../../services";
import { compactNumber, timeAgo } from "../../utils/time.js";

const CLASSIFICATION_TAG = {
    AI: { label: "Gerada por I.A.", short: "I.A", color: "var(--jello-ai)", icon: Bot },
    HUMAN: { label: "Arte Humana", short: "Arte Humana", color: "var(--jello-human)", icon: Palette },
};

export default function PostCard({
    id,
    userId,
    title,
    content,
    images = [],
    likes = 0,
    comments = 0,
    tags = [],
    user,
    author,
    createdAt,
    likedByMe = false,
    classification = "NONE",
    banned = false,
    aiVotes,
    onRemove
}) {
    const { user: me, isModerator } = useAuth();

    const [likeCount, setLikeCount] = useState(likes);
    const [liked, setLiked] = useState(likedByMe);
    const [commentCount, setCommentCount] = useState(comments);
    const [votes, setVotes] = useState(aiVotes);
    const [officialClass, setOfficialClass] = useState(classification);
    const [isBanned, setIsBanned] = useState(banned);
    const [showComments, setShowComments] = useState(false);

    const authorId = author?.id ?? userId;
    const following = useFollowState(authorId, author?.following ?? false);
    const authorIsModerator = author?.moderator ?? false;
    const authorName = author
        ? `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim()
        : `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
    const authorAvatar = author?.avatarId ?? user?.avatarId;
    const isOwn = me?.id === authorId;
    const profileLink = isOwn ? "/my-profile" : `/user-profile/${authorId}`;
    const officialTag = CLASSIFICATION_TAG[officialClass];

    const toggleLike = async () => {
        const next = !liked;
        setLiked(next);
        setLikeCount((count) => count + (next ? 1 : -1));
        try {
            if (next) {
                await likePost(id);
            } else {
                await unlikePost(id);
            }
        } catch (error) {
            // deu ruim, volta como estava
            setLiked(!next);
            setLikeCount((count) => count + (next ? -1 : 1));
            console.error("Erro ao curtir:", error);
        }
    };

    const reactivate = async () => {
        try {
            await unbanPost(id);
            setIsBanned(false);
        } catch (error) {
            console.error("Erro ao reativar post:", error);
        }
    };

    return (
        <article className={`${styles.post} ${isBanned ? styles.banned : ""}`}>
            {isBanned && (
                <div className={styles["banned-bar"]} role="status">
                    <span>Postagem banida. Só moderadores enxergam isso.</span>
                    {isModerator && (
                        <button type="button" onClick={reactivate}>Reativar</button>
                    )}
                </div>
            )}

            <header className={styles.header}>
                <Avatar avatarId={authorAvatar} name={authorName} size={44} to={profileLink} />

                <div className={styles.who}>
                    <div className={styles["name-row"]}>
                        <Link to={profileLink} className={styles.name}>{authorName || "Usuário"}</Link>
                        {isOwn && <span className={styles.me}>Você</span>}
                        {authorIsModerator && (
                            <span className={styles.mod} title="Esta pessoa é moderadora do JelloArt">
                                <ShieldCheck size={15} aria-hidden="true" /> Moderador
                            </span>
                        )}
                        {!isOwn && (
                            <FollowButton userId={authorId} following={following} />
                        )}
                    </div>
                    <span className={styles.time}>{timeAgo(createdAt)}</span>
                </div>

                <ReportOptions
                    postId={id}
                    userId={authorId}
                    username={author?.username ?? user?.username}
                    isOwn={isOwn}
                    onBanChange={setIsBanned}
                    onClassified={setOfficialClass}
                    classification={officialClass}
                    onRemove={onRemove}
                />
            </header>

            <h3 className={styles.title}>{title}</h3>
            {content && <p className={styles.content}>{content}</p>}

            <div className={styles.media}>
                <ImageCarousel images={images} alt={title} />
                {officialTag && officialClass === "AI" && (
                    <span className={styles["ai-ribbon"]}>
                        <Bot size={18} aria-hidden="true" /> {officialTag.label}
                    </span>
                )}
            </div>

            {officialTag ? (
                <p
                    className={styles.official}
                    style={{ "--official-color": officialTag.color }}
                >
                    <ShieldCheck size={17} aria-hidden="true" />
                    {officialClass === "AI"
                        ? "Um moderador classificou esta arte como gerada por I.A."
                        : "Um moderador confirmou que esta é arte humana."}
                </p>
            ) : !isOwn ? (
                <AiVotePanel postId={id} votes={votes} onChange={setVotes} />
            ) : (
                <p className={styles["vote-note"]}>
                    A comunidade votou: {votes?.ai ?? 0} acham que é IA, {votes?.human ?? 0} acham que é arte humana.
                </p>
            )}

            <footer className={styles.footer}>
                <div className={styles.stats}>
                    <button
                        type="button"
                        className={`${styles.stat} ${liked ? styles.liked : ""}`}
                        onClick={toggleLike}
                        aria-pressed={liked}
                        aria-label={liked ? "Descurtir" : "Curtir"}
                    >
                        <Heart size={20} fill={liked ? "currentColor" : "none"} strokeWidth={2.2} />
                        <span>{compactNumber(likeCount)}</span>
                    </button>

                    <button
                        type="button"
                        className={styles.stat}
                        onClick={() => setShowComments(true)}
                        aria-label="Ver comentários"
                    >
                        <img src={commentIcon} alt="" width={18} height={18} />
                        <span>{compactNumber(commentCount)}</span>
                    </button>
                </div>

                <div className={styles.tags}>
                    {tags.map((tag) => (
                        <span key={tag.id} className={styles.tag} style={{ background: tag.color }}>
                            {tag.name}
                        </span>
                    ))}
                    {officialTag && (
                        <span
                            className={`${styles.tag} ${styles["official-tag"]}`}
                            style={{ background: officialTag.color }}
                            title="Classificação oficial de um moderador"
                        >
                            {officialTag.short}
                        </span>
                    )}
                </div>
            </footer>

            <CommentsDialog
                open={showComments}
                onClose={() => setShowComments(false)}
                postId={id}
                postOwnerId={authorId}
                onCountChange={setCommentCount}
            />
        </article>
    );
}
