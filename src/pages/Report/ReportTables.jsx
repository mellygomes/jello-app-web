import { useEffect, useState } from "react";
import { Table, Tag, Tooltip, Modal } from "antd";
import { Ban, Check, Undo2 } from "lucide-react";
import PostReportInfo from "./PostReport/components/PostReportInfo";
import UserReportInfo from "./UserReport/components/UserReportInfo";
import {
    approvePostReport,
    approveUserReport,
    banPost,
    banUser,
    getPostsReports,
    getUsersReports,
    unapprovePostReport,
    unapproveUserReport,
    unbanPost,
    unbanUser,
} from "../../services";
import { getErrorMessage } from "../../lib/api.js";
import styles from "./reports.module.css";

const StatusTag = ({ approved }) =>
    approved
        ? <Tag color="green" variant="outlined">Procedente</Tag>
        : <Tag color="default" variant="outlined">Em análise</Tag>;

// botão de ícone das ações da tabela
function IconAction({ title, onClick, danger, children, disabled }) {
    return (
        <Tooltip placement="bottom" title={title}>
            <button
                type="button"
                className={`${styles.action} ${danger ? styles.danger : ""}`}
                onClick={onClick}
                disabled={disabled}
                aria-label={title}
            >
                {children}
            </button>
        </Tooltip>
    );
}

// Tabela de denúncias de posts (só moderador)
export function PostReportsTable() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        let cancelado = false;

        getPostsReports()
            .then((response) => !cancelado && setReports(response.data))
            .catch((err) => !cancelado && setError(getErrorMessage(err, "Não foi possível carregar as denúncias.")))
            .finally(() => !cancelado && setLoading(false));

        return () => {
            cancelado = true;
        };
    }, []);

    const patch = (id, changes) =>
        setReports((current) => current.map((report) => (report.id === id ? { ...report, ...changes } : report)));

    const run = async (action, id, changes) => {
        setError("");
        try {
            await action();
            patch(id, changes);
        } catch (err) {
            setError(getErrorMessage(err, "Não foi possível concluir a ação."));
        }
    };

    const columns = [
        { title: "Denunciante", dataIndex: "name", key: "name" },
        { title: "Motivo", dataIndex: "reportContent", key: "reportContent", width: "36%" },
        {
            title: "Postagem",
            key: "post",
            render: (_, report) => (
                <button type="button" className={styles.link} onClick={() => setSelected(report)}>{report.post}</button>
            ),
        },
        {
            title: "Situação",
            key: "approved",
            render: (_, report) => (
                <>
                    <StatusTag approved={report.approved} />
                    {report.postBanned && <Tag color="red" variant="outlined">Post banido</Tag>}
                </>
            ),
        },
        {
            title: "Ações",
            key: "action",
            render: (_, report) => (
                <div className={styles.actions}>
                    {report.approved ? (
                        <IconAction title="Reabrir análise" onClick={() => run(() => unapprovePostReport(report.id), report.id, { approved: false })}>
                            <Undo2 size={18} />
                        </IconAction>
                    ) : (
                        <IconAction title="Marcar como procedente" onClick={() => run(() => approvePostReport(report.id), report.id, { approved: true })}>
                            <Check size={18} />
                        </IconAction>
                    )}
                    {report.postBanned ? (
                        <IconAction title="Reativar postagem" onClick={() => run(() => unbanPost(report.postId), report.id, { postBanned: false })}>
                            <Undo2 size={18} />
                        </IconAction>
                    ) : (
                        <IconAction title="Banir postagem" danger onClick={() => run(() => banPost(report.postId), report.id, { postBanned: true })}>
                            <Ban size={18} />
                        </IconAction>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <Table
                rowKey="id"
                columns={columns}
                dataSource={reports}
                loading={loading}
                locale={{ emptyText: "Nenhuma denúncia de postagem." }}
                scroll={{ x: 760 }}
                pagination={{ pageSize: 8, hideOnSinglePage: true }}
            />
            <Modal
                title="Informações da Postagem"
                open={selected !== null}
                onCancel={() => setSelected(null)}
                footer={null}
            >
                {selected && (
                    <PostReportInfo title={selected.post} content={selected.postContent} images={selected.images} />
                )}
            </Modal>
        </>
    );
}

// Tabela de denúncias de usuários (só moderador)
export function UserReportsTable() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        let cancelado = false;

        getUsersReports()
            .then((response) => !cancelado && setReports(response.data))
            .catch((err) => !cancelado && setError(getErrorMessage(err, "Não foi possível carregar as denúncias.")))
            .finally(() => !cancelado && setLoading(false));

        return () => {
            cancelado = true;
        };
    }, []);

    const patch = (id, changes) =>
        setReports((current) => current.map((report) => (report.id === id ? { ...report, ...changes } : report)));

    const run = async (action, id, changes) => {
        setError("");
        try {
            await action();
            patch(id, changes);
        } catch (err) {
            setError(getErrorMessage(err, "Não foi possível concluir a ação."));
        }
    };

    const columns = [
        { title: "Denunciante", dataIndex: "userReporter", key: "userReporter" },
        { title: "Motivo", dataIndex: "content", key: "content", width: "36%" },
        {
            title: "Usuário denunciado",
            key: "userReported",
            render: (_, report) => (
                <button type="button" className={styles.link} onClick={() => setSelected(report)}>
                    {report.userReported.firstName}
                </button>
            ),
        },
        {
            title: "Situação",
            key: "approved",
            render: (_, report) => (
                <>
                    <StatusTag approved={report.approved} />
                    {report.reportedBanned && <Tag color="red" variant="outlined">Banido</Tag>}
                </>
            ),
        },
        {
            title: "Ações",
            key: "action",
            render: (_, report) => (
                <div className={styles.actions}>
                    {report.approved ? (
                        <IconAction title="Reabrir análise" onClick={() => run(() => unapproveUserReport(report.id), report.id, { approved: false })}>
                            <Undo2 size={18} />
                        </IconAction>
                    ) : (
                        <IconAction title="Marcar como procedente" onClick={() => run(() => approveUserReport(report.id), report.id, { approved: true })}>
                            <Check size={18} />
                        </IconAction>
                    )}
                    {report.reportedBanned ? (
                        <IconAction title="Reativar usuário" onClick={() => run(() => unbanUser(report.reportedId), report.id, { reportedBanned: false })}>
                            <Undo2 size={18} />
                        </IconAction>
                    ) : (
                        <IconAction title="Banir usuário" danger onClick={() => run(() => banUser(report.reportedId), report.id, { reportedBanned: true })}>
                            <Ban size={18} />
                        </IconAction>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <Table
                rowKey="id"
                columns={columns}
                dataSource={reports}
                loading={loading}
                locale={{ emptyText: "Nenhuma denúncia de usuário." }}
                scroll={{ x: 760 }}
                pagination={{ pageSize: 8, hideOnSinglePage: true }}
            />
            <Modal
                title="Informações do Usuário Denunciado"
                open={selected !== null}
                onCancel={() => setSelected(null)}
                footer={null}
            >
                {selected && (
                    <UserReportInfo
                        name={`${selected.userReported.firstName} ${selected.userReported.lastName ?? ""}`.trim()}
                        username={selected.userReported.username}
                        bio={selected.userReported.bio}
                        email={selected.userReported.email}
                        userId={selected.reportedId}
                    />
                )}
            </Modal>
        </>
    );
}
