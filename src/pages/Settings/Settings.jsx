import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Monitor, Moon, ShieldCheck, Sun } from "lucide-react";
import styles from "./settings.module.css";
import { AppLayout } from "../../components/Layout";
import PasswordField from "../../components/PasswordField";
import ConfirmDialog from "../../components/ConfirmDialog";
import Button from "../../components/Button";
import Avatar from "../../components/Avatar";
import { useAuth, useLogout, useTheme } from "../../hooks";
import { changePassword, deleteAccount } from "../../services";
import { getErrorMessage } from "../../lib/api.js";

const THEMES = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Escuro", icon: Moon },
    { value: "system", label: "Automático", icon: Monitor },
];

// Configurações da conta: aparência, senha, sessão e exclusão de conta
export default function Settings() {
    const { user, logout, isModerator } = useAuth();
    const { mode, setMode } = useTheme();
    const navigate = useNavigate();
    const handleLogout = useLogout();

    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({ type: "", text: "" });
    const [saving, setSaving] = useState(false);

    const [deleting, setDeleting] = useState(false);
    const [deleteBusy, setDeleteBusy] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage({ type: "", text: "" });

        const found = {};
        if (!current) found.current = "Digite sua senha atual";
        if (next.length < 8) found.next = "A nova senha precisa de pelo menos 8 caracteres";
        if (next && next === current) found.next = "A nova senha deve ser diferente da atual";
        if (next !== confirm) found.confirm = "As senhas não coincidem";
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        setSaving(true);
        try {
            await changePassword({ currentPassword: current, newPassword: next });
            setCurrent("");
            setNext("");
            setConfirm("");
            setMessage({ type: "ok", text: "Senha alterada com sucesso." });
        } catch (error) {
            setMessage({ type: "error", text: getErrorMessage(error, "Não foi possível alterar a senha.") });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleteBusy(true);
        setDeleteError("");
        try {
            await deleteAccount(user.id);
            logout();
            navigate("/login");
        } catch (error) {
            setDeleteError(getErrorMessage(error, "Não foi possível excluir a conta."));
        } finally {
            setDeleteBusy(false);
        }
    };

    const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || user?.username;

    return (
        <AppLayout title="Configurações">
            <div className={styles.grid}>
                <section className={styles.card} aria-labelledby="cfg-conta">
                    <h2 id="cfg-conta">Sua conta</h2>
                    <div className={styles.account}>
                        <Avatar avatarId={user?.avatarId} name={fullName} size={84} />
                        <div>
                            <strong>{fullName}</strong>
                            <span>@{user?.username}</span>
                            <span>{user?.email}</span>
                            {isModerator && (
                                <em className={styles.badge}><ShieldCheck size={15} aria-hidden="true" /> Moderador</em>
                            )}
                        </div>
                    </div>
                    <div className={styles.row}>
                        <Link to="/my-profile/edit" className={styles.link}>Editar perfil</Link>
                        <Link to="/my-profile" className={styles.link}>Ver meu perfil</Link>
                    </div>
                </section>

                <section className={styles.card} aria-labelledby="cfg-tema">
                    <h2 id="cfg-tema">Aparência</h2>
                    <p className={styles.help}>Escolha como o JelloArt aparece para você. Fica salvo neste navegador.</p>
                    <div className={styles.themes} role="radiogroup" aria-label="Tema">
                        {THEMES.map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                type="button"
                                role="radio"
                                aria-checked={mode === value}
                                className={`${styles.theme} ${mode === value ? styles.selected : ""}`}
                                onClick={() => setMode(value)}
                            >
                                <Icon size={26} aria-hidden="true" />
                                {label}
                            </button>
                        ))}
                    </div>
                </section>

                <section className={styles.card} aria-labelledby="cfg-senha">
                    <h2 id="cfg-senha">Alterar senha</h2>
                    <p className={styles.help}>Use pelo menos 8 caracteres. A sessão atual continua ativa depois de trocar.</p>

                    <form onSubmit={handleSubmit} className={styles.form} noValidate>
                        <PasswordField label="Senha atual" value={current} onChange={(e) => setCurrent(e.target.value)} error={errors.current} autoComplete="current-password" />
                        <PasswordField label="Nova senha" value={next} onChange={(e) => setNext(e.target.value)} error={errors.next} autoComplete="new-password" />
                        <PasswordField label="Confirmar nova senha" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} autoComplete="new-password" />

                        {message.text && (
                            <p className={message.type === "ok" ? styles.ok : styles.error} role="status">{message.text}</p>
                        )}

                        <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar nova senha"}</Button>
                    </form>
                </section>

                <div className={styles.stack}>
                    <section className={styles.card} aria-labelledby="cfg-sessao">
                        <h2 id="cfg-sessao">Sessão</h2>
                        <p className={styles.help}>Saia da sua conta neste navegador.</p>
                        <Button variant="ghost" onClick={handleLogout}>Fazer logout</Button>
                    </section>

                    <section className={`${styles.card} ${styles.danger}`} aria-labelledby="cfg-perigo">
                        <h2 id="cfg-perigo">Excluir conta</h2>
                        <p className={styles.help}>Apaga seu perfil, seus posts e comentários de vez. Não dá para desfazer.</p>
                        <Button variant="danger" onClick={() => { setDeleteError(""); setDeleting(true); }}>Excluir minha conta</Button>
                    </section>
                </div>
            </div>

            <ConfirmDialog
                open={deleting}
                onClose={() => setDeleting(false)}
                title="Excluir sua conta?"
                message={deleteError || `A conta @${user?.username ?? ""} e tudo que você publicou serão apagados permanentemente.`}
                confirmLabel="Sim, excluir"
                danger
                loading={deleteBusy}
                onConfirm={handleDelete}
            />
        </AppLayout>
    );
}
