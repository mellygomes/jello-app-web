import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageCircle, Send, ShieldCheck, Trash2 } from "lucide-react";
import Dialog from "../Dialog";
import Avatar from "../Avatar";
import { useAuth } from "../../hooks/useAuth.js";
import { addComment, deleteComment, getComments } from "../../services";
import { getErrorMessage } from "../../lib/api.js";
import { timeAgo } from "../../utils/time.js";
import styles from "./comments.module.css";

function CommentItem({ comment, replies, canDelete, onReply, onDelete, myId, depth = 0 }) {
    const [showReplies, setShowReplies] = useState(false);
    const isMine = comment.userId === myId;

    return (
        <li className={styles.item}>
            <Avatar avatarId={comment.userAvatarId} name={comment.user} size={52} to={`/user-profile/${comment.userId}`} />

            <div className={styles.main}>
                <div className={styles.meta}>
                    <strong>{comment.user}</strong>
                    {isMine && <span className={styles.me}>Você</span>}
                    {comment.userModerator && (
                        <span className={styles.mod} title="Moderador"><ShieldCheck size={13} aria-hidden="true" /> Moderador</span>
                    )}
                    <time>{timeAgo(comment.createdAt)}</time>
                </div>
                <p className={styles.text}>{comment.content}</p>

                <div className={styles.actions}>
                    {replies.length > 0 ? (
                        <button type="button" onClick={() => setShowReplies((v) => !v)}>
                            {showReplies ? "Ocultar respostas" : `Ver mais ${replies.length} ${replies.length === 1 ? "resposta" : "respostas"}`}
                        </button>
                    ) : <span />}

                    <div className={styles.right}>
                        {canDelete(comment) && (
                            <button type="button" onClick={() => onDelete(comment)} aria-label="Excluir comentário">
                                <Trash2 size={16} /> Excluir
                            </button>
                        )}
                        {depth === 0 && (
                            <button type="button" onClick={() => onReply(comment)}>
                                <MessageCircle size={16} /> Responder
                            </button>
                        )}
                    </div>
                </div>

                {showReplies && replies.length > 0 && (
                    <ul className={styles.replies}>
                        {replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                replies={[]}
                                canDelete={canDelete}
                                onReply={onReply}
                                onDelete={onDelete}
                                myId={myId}
                                depth={1}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </li>
    );
}

export default function CommentsDialog({ open, onClose, postId, postOwnerId, onCountChange }) {
    const { user, isModerator } = useAuth();

    const [comments, setComments] = useState(null);
    const [text, setText] = useState("");
    const [replyTo, setReplyTo] = useState(null);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        try {
            const response = await getComments(postId);
            const list = response.data ?? [];
            setComments(list);
            setError("");
            onCountChange?.(list.length);
        } catch (err) {
            setComments((current) => current ?? []);
            setError(getErrorMessage(err, "Não foi possível carregar os comentários."));
        }
    }, [postId, onCountChange]);

    // carrega ao abrir (setState só dentro do callback assíncrono)
    useEffect(() => {
        if (!open) return;

        let cancelled = false;
        getComments(postId)
            .then((response) => {
                if (cancelled) return;
                const list = response.data ?? [];
                setComments(list);
                onCountChange?.(list.length);
            })
            .catch((err) => {
                if (cancelled) return;
                setComments([]);
                setError(getErrorMessage(err, "Não foi possível carregar os comentários."));
            });

        return () => {
            cancelled = true;
        };
    }, [open, postId, onCountChange]);

    // separa comentários principais e respostas
    const { roots, repliesByParent } = useMemo(() => {
        const map = new Map();
        const main = [];
        (comments ?? []).forEach((comment) => {
            if (comment.parentId) {
                map.set(comment.parentId, [...(map.get(comment.parentId) ?? []), comment]);
            } else {
                main.push(comment);
            }
        });
        return { roots: main, repliesByParent: map };
    }, [comments]);

    const canDelete = (comment) =>
        isModerator || comment.userId === user?.id || postOwnerId === user?.id;

    const handleSend = async (event) => {
        event.preventDefault();
        const value = text.trim();
        if (!value || sending) return;

        setSending(true);
        setError("");
        try {
            await addComment(postId, value, replyTo?.id);
            setText("");
            setReplyTo(null);
            await load();
        } catch (err) {
            setError(getErrorMessage(err, "Não foi possível enviar o comentário."));
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (comment) => {
        try {
            await deleteComment(comment.id);
            await load();
        } catch (err) {
            setError(getErrorMessage(err, "Não foi possível excluir o comentário."));
        }
    };

    return (
        <Dialog open={open} onClose={onClose} title={`Comentários (${comments?.length ?? 0})`} width={780}>
            {comments === null && <p className={styles.empty}>Carregando...</p>}
            {comments !== null && comments.length === 0 && !error && (
                <p className={styles.empty}>Ninguém comentou ainda. Seja a primeira pessoa!</p>
            )}

            <ul className={styles.list}>
                {roots.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        replies={repliesByParent.get(comment.id) ?? []}
                        canDelete={canDelete}
                        onReply={setReplyTo}
                        onDelete={handleDelete}
                        myId={user?.id}
                    />
                ))}
            </ul>

            {error && <p className={styles.error} role="alert">{error}</p>}

            <form className={styles.form} onSubmit={handleSend}>
                {replyTo && (
                    <div className={styles["reply-chip"]}>
                        Respondendo a <strong>{replyTo.user}</strong>
                        <button type="button" onClick={() => setReplyTo(null)} aria-label="Cancelar resposta">×</button>
                    </div>
                )}
                <div className={styles.field}>
                    <input
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        placeholder="Escreva um comentário..."
                        maxLength={255}
                        aria-label="Comentário"
                    />
                    <button type="submit" disabled={sending || !text.trim()} aria-label="Enviar comentário">
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </Dialog>
    );
}
