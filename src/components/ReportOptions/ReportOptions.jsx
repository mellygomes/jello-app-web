import { useEffect, useRef, useState } from "react";
import { Ban, CircleUserRound, Flag, MoreHorizontal, ShieldCheck, Trash2 } from "lucide-react";
import styles from "./report-options.module.css";
import CreateReportModal from "./CreateReportModal";
import ClassificationDialog from "./ClassificationDialog";
import ConfirmDialog from "../ConfirmDialog";
import { useAuth } from "../../hooks/useAuth.js";
import { usePostReport, useUserReport } from "../../hooks";
import { banPost, banUser, deletePost } from "../../services";
import { getErrorMessage } from "../../lib/api.js";

// Menu "..." do post: denúncias pra todo mundo, poderes de moderador pra quem tem o cargo
export default function ReportOptions({
    postId,
    userId,
    username,
    isOwn = false,
    classification = "NONE",
    onBanChange,
    onClassified,
    onRemove
}) {
    const { isModerator } = useAuth();
    const { submitReport: createPostReport } = usePostReport();
    const { submitReport: createUserReport } = useUserReport();

    const [menuOpen, setMenuOpen] = useState(false);
    const [modal, setModal] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const wrapperRef = useRef(null);

    // fecha o menu clicando fora ou apertando Esc
    useEffect(() => {
        if (!menuOpen) return;

        const onClick = (event) => {
            if (!wrapperRef.current?.contains(event.target)) setMenuOpen(false);
        };
        const onKey = (event) => event.key === "Escape" && setMenuOpen(false);

        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [menuOpen]);

    const open = (name) => {
        setMenuOpen(false);
        setError("");
        setModal(name);
    };

    const runAction = async (action, after) => {
        setBusy(true);
        setError("");
        try {
            await action();
            after?.();
            setModal(null);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setBusy(false);
        }
    };

    const canDelete = isOwn || isModerator;
    const showMenu = !isOwn || canDelete;

    if (!showMenu) return null;

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            <button
                type="button"
                className={styles.trigger}
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Mais opções"
            >
                <MoreHorizontal size={28} />
            </button>

            {menuOpen && (
                <div className={styles.menu} role="menu">
                    {!isOwn && (
                        <button type="button" role="menuitem" onClick={() => open("report-post")}>
                            <Flag size={22} fill="currentColor" /> Denunciar postagem
                        </button>
                    )}
                    {!isOwn && (
                        <button type="button" role="menuitem" onClick={() => open("report-user")}>
                            <CircleUserRound size={22} /> Denunciar usuário
                        </button>
                    )}

                    {isModerator && !isOwn && (
                        <>
                            <button type="button" role="menuitem" onClick={() => open("ban-user")}>
                                <Ban size={22} /> Bloquear @{username ?? "usuário"}
                            </button>
                            <button type="button" role="menuitem" onClick={() => open("classify")}>
                                <ShieldCheck size={22} /> Adicionar classificação
                            </button>
                            <button type="button" role="menuitem" onClick={() => open("ban-post")}>
                                <Ban size={22} /> Banir postagem
                            </button>
                        </>
                    )}

                    {canDelete && (
                        <button type="button" role="menuitem" onClick={() => open("delete")}>
                            <Trash2 size={22} /> Excluir postagem
                        </button>
                    )}
                </div>
            )}

            <CreateReportModal
                open={modal === "report-post"}
                onClose={() => setModal(null)}
                id={postId}
                onSubmit={createPostReport}
                title="Denúncia de Postagem"
            />
            <CreateReportModal
                open={modal === "report-user"}
                onClose={() => setModal(null)}
                id={userId}
                onSubmit={createUserReport}
                title="Denúncia de Usuário"
            />

            {modal === "classify" && (
                <ClassificationDialog
                    open
                    onClose={() => setModal(null)}
                    postId={postId}
                    current={classification}
                    onDone={onClassified}
                />
            )}

            <ConfirmDialog
                open={modal === "ban-user"}
                onClose={() => setModal(null)}
                title={`Bloquear @${username ?? "usuário"}?`}
                message={error || "A conta perde o acesso ao JelloArt e os posts dela somem para os outros usuários. Dá pra desfazer na tela de moderação."}
                confirmLabel="Bloquear usuário"
                danger
                loading={busy}
                onConfirm={() => runAction(() => banUser(userId), () => onBanChange?.(true))}
            />

            <ConfirmDialog
                open={modal === "ban-post"}
                onClose={() => setModal(null)}
                title="Banir esta postagem?"
                message={error || "A postagem some do feed, do explorar e do perfil. Dá pra reativar depois."}
                confirmLabel="Banir postagem"
                danger
                loading={busy}
                onConfirm={() => runAction(() => banPost(postId), () => onBanChange?.(true))}
            />

            <ConfirmDialog
                open={modal === "delete"}
                onClose={() => setModal(null)}
                title="Excluir postagem?"
                message={error || "Essa ação apaga a postagem, as imagens e os comentários de vez."}
                confirmLabel="Excluir"
                danger
                loading={busy}
                onConfirm={() => runAction(() => deletePost(postId), () => onRemove?.(postId))}
            />
        </div>
    )
}
