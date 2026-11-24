import { useEffect, useState } from "react";
import styles from "./friends.module.css";
import { AppLayout } from "../../components/Layout";
import SearchBar from "../../components/SearchBar";
import UserCard from "../../components/UserCard";
import FollowButton from "../../components/FollowButton";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../hooks";
import { getFollowers, getFollowing, searchUsers } from "../../services";
import { getErrorMessage } from "../../lib/api.js";

const TABS = [
    { key: "following", label: "Seguindo" },
    { key: "followers", label: "Seguidores" },
];

// Tela Amigos: quem você segue, quem segue você e busca de pessoas
export default function Friends() {
    const { user } = useAuth();

    const [tab, setTab] = useState("following");
    const [list, setList] = useState({ key: null, people: [], error: "" });
    const [query, setQuery] = useState("");
    const [search, setSearch] = useState(null);

    const searching = search !== null;
    const listKey = `${tab}|${user?.id}`;

    useEffect(() => {
        if (!user) return;

        let cancelled = false;
        const request = tab === "following" ? getFollowing(user.id) : getFollowers(user.id);

        request
            .then((response) => !cancelled && setList({ key: listKey, people: response.data ?? [], error: "" }))
            .catch((err) => !cancelled && setList({
                key: listKey,
                people: [],
                error: getErrorMessage(err, "Não foi possível carregar a lista."),
            }));

        return () => {
            cancelled = true;
        };
    }, [tab, user, listKey]);

    const runSearch = async () => {
        const value = query.trim();
        if (value.length < 2) {
            setSearch(null);
            return;
        }

        setSearch({ loading: true, people: [], error: "" });
        try {
            const response = await searchUsers(value);
            setSearch({ loading: false, people: response.data ?? [], error: "" });
        } catch (err) {
            setSearch({ loading: false, people: [], error: getErrorMessage(err, "Não foi possível buscar.") });
        }
    };

    const loading = searching ? search.loading : list.key !== listKey;
    const error = searching ? search.error : list.error;
    const people = searching ? search.people : list.people;

    const updateFollowing = (id, following) => {
        const mark = (items) => items.map((p) => (p.id === id ? { ...p, following } : p));

        if (searching) {
            setSearch((current) => ({ ...current, people: mark(current.people) }));
        } else {
            setList((current) => ({ ...current, people: mark(current.people) }));
        }
    };

    return (
        <AppLayout
            headerExtra={
                <SearchBar
                    value={query}
                    onChange={(value) => { setQuery(value); if (!value) setSearch(null); }}
                    onSubmit={runSearch}
                    placeholder="Buscar pessoas pelo nome ou usuário..."
                />
            }
            title="Amigos"
        >
            {!searching && (
                <div className={styles.tabs} role="tablist">
                    {TABS.map(({ key, label }) => (
                        <button
                            key={key}
                            type="button"
                            role="tab"
                            aria-selected={tab === key}
                            className={tab === key ? styles.active : ""}
                            onClick={() => setTab(key)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}
            {searching && <p className={styles.result}>Resultado da busca por “{query.trim()}”</p>}

            {loading ? (
                <div className={styles.state}><Spinner size={28} color="#282828" /></div>
            ) : error ? (
                <p className={styles.state}>{error}</p>
            ) : people.length === 0 ? (
                <p className={styles.state}>
                    {searching
                        ? "Ninguém encontrado."
                        : tab === "following"
                            ? "Você ainda não segue ninguém. Que tal dar uma olhada no Explorar?"
                            : "Ninguém te segue ainda."}
                </p>
            ) : (
                <ul className={styles.list}>
                    {people.map((person) => (
                        <UserCard key={person.id} person={person}>
                            <FollowButton
                                userId={person.id}
                                following={Boolean(person.following)}
                                onChange={(value) => updateFollowing(person.id, value)}
                            />
                        </UserCard>
                    ))}
                </ul>
            )}
        </AppLayout>
    );
}
