import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "antd";
import styles from "./moderation.module.css";
import { AppLayout } from "../../components/Layout";
import PostCard from "../../components/PostList/PostCard.jsx";
import UserCard from "../../components/UserCard";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import { PostReportsTable, UserReportsTable } from "../Report/ReportTables.jsx";
import { usePagedPosts } from "../../hooks/usePagedPosts.js";
import { getBannedPosts, getBannedUsers, getModerationQueue, unbanUser } from "../../services";
import { getErrorMessage } from "../../lib/api.js";

const TABS = [
    { key: "queue", label: "Votos de IA" },
    { key: "posts", label: "Denúncias de posts" },
    { key: "users", label: "Denúncias de usuários" },
    { key: "banned", label: "Banidos" },
];

const PAGE_SIZE = 6;

// Fila de posts que a comunidade marcou como IA e ainda sem veredito
function QueueTab() {
    const [page, setPage] = useState(1);
    const { posts, total, loading, error, removePost } = usePagedPosts(getModerationQueue, page, PAGE_SIZE, null);

    return (
        <>
            <p className={styles.intro}>
                Posts com votos de “parece IA” e sem classificação oficial. Abra o menu <strong>…</strong> do post
                e use <strong>Adicionar classificação</strong> para dar o veredito.
            </p>
            {loading ? <div className={styles.state}><Spinner size={28} color="#282828" /></div>
                : error ? <p className={styles.state}>{error}</p>
                : posts.length === 0 ? <p className={styles.state}>Nada na fila. Bom trabalho!</p>
                : (
                    <div className={styles.grid}>
                        {posts.map((post) => <PostCard key={post.id} {...post} onRemove={removePost} />)}
                    </div>
                )}
            {total > PAGE_SIZE && (
                <div className={styles.pagination}>
                    <Pagination current={page} pageSize={PAGE_SIZE} total={total} onChange={setPage} showSizeChanger={false} />
                </div>
            )}
        </>
    );
}

// Usuários e posts banidos, com opção de reativar
function BannedTab() {
    const [page, setPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [usersError, setUsersError] = useState("");
    const { posts, total, loading, error, removePost } = usePagedPosts(getBannedPosts, page, PAGE_SIZE, null);

    useEffect(() => {
        let cancelled = false;
        getBannedUsers()
            .then((response) => !cancelled && setUsers(response.data ?? []))
            .catch((err) => !cancelled && setUsersError(getErrorMessage(err, "Não foi possível carregar os usuários.")))
            .finally(() => !cancelled && setUsersLoading(false));
        return () => {
            cancelled = true;
        };
    }, []);

    const reactivate = useCallback(async (id) => {
        try {
            await unbanUser(id);
            setUsers((current) => current.filter((person) => person.id !== id));
        } catch (err) {
            setUsersError(getErrorMessage(err));
        }
    }, []);

    return (
        <>
            <h2 className={styles.sub}>Usuários banidos</h2>
            {usersLoading ? <div className={styles.state}><Spinner size={24} color="#282828" /></div>
                : usersError ? <p className={styles.state}>{usersError}</p>
                : users.length === 0 ? <p className={styles.state}>Nenhum usuário banido.</p>
                : (
                    <ul className={styles.users}>
                        {users.map((person) => (
                            <UserCard key={person.id} person={person}>
                                <Button size="small" variant="ghost" onClick={() => reactivate(person.id)}>Reativar</Button>
                            </UserCard>
                        ))}
                    </ul>
                )}

            <h2 className={styles.sub}>Posts banidos</h2>
            {loading ? <div className={styles.state}><Spinner size={24} color="#282828" /></div>
                : error ? <p className={styles.state}>{error}</p>
                : posts.length === 0 ? <p className={styles.state}>Nenhum post banido.</p>
                : (
                    <div className={styles.grid}>
                        {posts.map((post) => <PostCard key={post.id} {...post} onRemove={removePost} />)}
                    </div>
                )}
            {total > PAGE_SIZE && (
                <div className={styles.pagination}>
                    <Pagination current={page} pageSize={PAGE_SIZE} total={total} onChange={setPage} showSizeChanger={false} />
                </div>
            )}
        </>
    );
}

// Central do moderador
export default function Moderation() {
    const [params, setParams] = useSearchParams();
    const tab = TABS.some((item) => item.key === params.get("tab")) ? params.get("tab") : "queue";

    return (
        <AppLayout title="Moderação">
            <div className={styles.tabs} role="tablist">
                {TABS.map(({ key, label }) => (
                    <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={tab === key}
                        className={tab === key ? styles.active : ""}
                        onClick={() => setParams({ tab: key })}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className={styles.panel}>
                {tab === "queue" && <QueueTab />}
                {tab === "posts" && <PostReportsTable />}
                {tab === "users" && <UserReportsTable />}
                {tab === "banned" && <BannedTab />}
            </div>
        </AppLayout>
    );
}
