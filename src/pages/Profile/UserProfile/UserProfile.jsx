import { useCallback, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Ban, Flag, FolderOpen, Pencil, ShieldCheck } from "lucide-react";
import styles from "./user-profile.module.css";
import TopBar from "../../../components/TopBar";
import Avatar from "../../../components/Avatar";
import SearchBar from "../../../components/SearchBar";
import TagFilterBar from "../../../components/Filter/TagFilterBar.jsx";
import PostList from "../../../components/PostList";
import ConfirmDialog from "../../../components/ConfirmDialog";
import CreateReportModal from "../../../components/ReportOptions/CreateReportModal";
import Spinner from "../../../components/Spinner";
import InfiniteSentinel from "../../../components/InfiniteSentinel";
import FollowButton from "../../../components/FollowButton";
import { useAuth, useFilter, useUserProfile, useUserReport } from "../../../hooks";
import { useInfinitePosts } from "../../../hooks/useInfinitePosts.js";
import { banUser, getAllPostsByUser, unbanUser } from "../../../services";
import { getErrorMessage } from "../../../lib/api.js";

const PAGE_SIZE = 5;

// Perfil (tela "Profile View" do Figma). Serve pro perfil de outra pessoa e, com own, pro meu próprio
export default function UserProfile({ own = false }) {

    const navigate = useNavigate();
    const params = useParams();
    const { user, isModerator } = useAuth();
    const userId = own ? user?.id : params.userId;
    const isOwn = own || (user && String(user.id) === String(userId));

    const [reporting, setReporting] = useState(false);
    const [banning, setBanning] = useState(false);
    const [busy, setBusy] = useState(false);
    const [actionError, setActionError] = useState("");

    const { setField, reset, draft, applied, apply } = useFilter();
    const fetchPosts = useCallback(
        (pageIndex, size, currentFilter) => getAllPostsByUser(userId, pageIndex, size, currentFilter),
        [userId]
    );
    const { posts, loading: loadingPosts, loadingMore, hasMore, error: postsError, loadMore, removePost } =
        useInfinitePosts(fetchPosts, PAGE_SIZE, applied, Boolean(userId), String(userId));
    const { profile, setProfile, profileLoading, profileError, avatarUrl, coverUrl } = useUserProfile(userId);
    const { submitReport } = useUserReport();

    if (!own && isOwn) return <Navigate to="/my-profile" replace />;

    const fullName = `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim();

    const applyFilters = (next) => apply(next);

    const toggleBan = async () => {
        setBusy(true);
        setActionError("");
        try {
            if (profile.banned) {
                await unbanUser(userId);
            } else {
                await banUser(userId);
            }
            setProfile((current) => ({ ...current, banned: !current.banned }));
            setBanning(false);
        } catch (err) {
            setActionError(getErrorMessage(err));
        } finally {
            setBusy(false);
        }
    };

    const handleFollowChange = (following) => {
        setProfile((current) => ({
            ...current,
            followedByMe: following,
            followers: Math.max(0, (current.followers ?? 0) + (following ? 1 : -1)),
        }));
    };

    return (
        <div className={styles.page}>
            <TopBar />

            <div className={styles.container}>
                <section className={styles.card} aria-label="Perfil">
                    <div className={styles.cover}>
                        {coverUrl && <img src={coverUrl} alt="" />}
                    </div>

                    <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Voltar">
                        <ArrowLeft size={26} strokeWidth={2.6} aria-hidden="true" />
                    </button>

                    {profileLoading ? (
                        <div className={styles.loading}><Spinner size={28} color="#282828" /></div>
                    ) : profileError || !profile ? (
                        <p className={styles.loading}>Não foi possível carregar este perfil.</p>
                    ) : (
                        <>
                            <div className={styles.avatar}>
                                <Avatar src={avatarUrl} name={fullName} size={200} />
                            </div>

                            <div className={styles.info}>
                                <h1 className={styles.name}>
                                    {fullName}
                                    {profile.moderator && (
                                        <span className={styles.verified} title="Moderador">
                                            <ShieldCheck size={26} aria-label="Moderador" />
                                        </span>
                                    )}
                                </h1>
                                <p className={styles.username}>@{profile.username}</p>
                                {profile.banned && <p className={styles["banned-note"]}>Conta suspensa por um moderador</p>}

                                <div className={styles.buttons}>
                                    {isOwn ? (
                                        <Link to="/my-profile/edit" className={styles["edit-link"]}>
                                            <Pencil size={22} aria-hidden="true" /> Editar perfil
                                        </Link>
                                    ) : (
                                        <FollowButton
                                            userId={profile.id ?? Number(userId)}
                                            following={Boolean(profile.followedByMe)}
                                            onChange={handleFollowChange}
                                            className={styles["follow-big"]}
                                        />
                                    )}
                                    <Link to={isOwn ? "/portfolio" : `/portfolio/${userId}`} className={styles.portfolio}>
                                        <FolderOpen size={24} aria-hidden="true" /> {isOwn ? "Meu Portfólio" : "Acessar Portfólio"}
                                    </Link>
                                </div>

                                <dl className={styles.stats}>
                                    <div><dt>Seguidores</dt><dd>{profile.followers ?? 0}</dd></div>
                                    <div><dt>Seguindo</dt><dd>{profile.following ?? 0}</dd></div>
                                    <div><dt>Posts</dt><dd>{profile.posts ?? 0}</dd></div>
                                </dl>

                                {!isOwn && (
                                    <div className={styles.tools}>
                                        <button type="button" onClick={() => setReporting(true)}>
                                            <Flag size={18} aria-hidden="true" /> Denunciar usuário
                                        </button>
                                        {isModerator && !profile.moderator && (
                                            <button type="button" className={styles.danger} onClick={() => setBanning(true)}>
                                                <Ban size={18} aria-hidden="true" /> {profile.banned ? "Reativar usuário" : "Banir usuário"}
                                            </button>
                                        )}
                                    </div>
                                )}

                                <section className={styles.about}>
                                    <h2>SOBRE</h2>
                                    {profile.bio ? (
                                        <p>{profile.bio}</p>
                                    ) : isOwn ? (
                                        <p className={styles["about-empty"]}>
                                            Você ainda não escreveu uma descrição. <Link to="/my-profile/edit">Adicionar agora</Link>
                                        </p>
                                    ) : (
                                        <p>Esta pessoa ainda não escreveu nada por aqui.</p>
                                    )}
                                </section>
                            </div>
                        </>
                    )}
                </section>

                <section className={styles.posts} aria-label="Posts">
                    <SearchBar
                        value={draft.search}
                        onChange={(value) => setField("search", value)}
                        onSubmit={() => applyFilters()}
                    />

                    <TagFilterBar
                        filter={draft}
                        onChange={(name, value) => {
                            setField(name, value);
                            if (name !== "search") applyFilters({ ...draft, [name]: value });
                        }}
                    />

                    {loadingPosts ? (
                        <div className={styles.loading}><Spinner size={28} color="#282828" /></div>
                    ) : postsError && posts.length === 0 ? (
                        <p className={styles.empty}>{postsError}</p>
                    ) : posts.length === 0 ? (
                        <p className={styles.empty}>
                            {isOwn ? "Você ainda não publicou nada." : "Nenhum post por aqui."}
                            {(applied.search || applied.tags?.length > 0 || applied.showAi) && (
                                <> <button type="button" className={styles.link} onClick={reset}>Limpar filtros</button></>
                            )}
                        </p>
                    ) : (
                        <>
                            <PostList posts={posts} onRemove={removePost} />
                            <InfiniteSentinel
                                onVisible={loadMore}
                                hasMore={hasMore}
                                loading={loadingMore}
                                endMessage="Sem mais posts por aqui."
                            />
                        </>
                    )}
                </section>
            </div>

            <CreateReportModal
                open={reporting}
                onClose={() => setReporting(false)}
                id={Number(userId)}
                onSubmit={submitReport}
                title="Denúncia de Usuário"
            />

            <ConfirmDialog
                open={banning}
                onClose={() => setBanning(false)}
                title={profile?.banned ? "Reativar este usuário?" : "Banir este usuário?"}
                message={actionError || (profile?.banned
                    ? "A conta volta a funcionar e os posts reaparecem."
                    : "A conta perde o acesso e os posts somem para os outros usuários.")}
                confirmLabel={profile?.banned ? "Reativar" : "Banir"}
                danger={!profile?.banned}
                loading={busy}
                onConfirm={toggleBan}
            />
        </div>
    );
}
