import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import Avatar from "../Avatar";
import styles from "./user-card.module.css";

// Linha com foto, nome e uma ação (seguir, reativar...) à direita
export default function UserCard({ person, children }) {
    const name = `${person.firstName ?? ""} ${person.lastName ?? ""}`.trim();

    return (
        <li className={styles.card}>
            <Avatar avatarId={person.avatarId} name={name} size={56} to={`/user-profile/${person.id}`} />
            <Link to={`/user-profile/${person.id}`} className={styles.names}>
                <strong>
                    {name}
                    {person.moderator && <ShieldCheck size={16} className={styles.mod} aria-label="Moderador" />}
                </strong>
                <span>@{person.username}</span>
            </Link>
            <div className={styles.action}>{children}</div>
        </li>
    );
}
