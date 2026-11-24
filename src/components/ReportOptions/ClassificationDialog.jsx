import { useState } from "react";
import { Bot, Palette, Eraser } from "lucide-react";
import Dialog from "../Dialog";
import Button from "../Button";
import { classifyPost } from "../../services";
import { getErrorMessage } from "../../lib/api.js";
import styles from "./classification-dialog.module.css";

const OPTIONS = [
    { value: "AI", label: "Gerada por IA", hint: "O post ganha o selo I.A visível pra todo mundo.", icon: Bot },
    { value: "HUMAN", label: "Arte humana", hint: "O post ganha o selo Arte Humana.", icon: Palette },
    { value: "NONE", label: "Sem classificação", hint: "Tira o selo e volta pra votação da comunidade.", icon: Eraser },
];

// Moderador decide de vez: IA, humana ou limpa a classificação
export default function ClassificationDialog({ open, onClose, postId, current = "NONE", onDone }) {
    const [selected, setSelected] = useState(current);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const save = async () => {
        setSaving(true);
        setError("");
        try {
            await classifyPost(postId, selected);
            onDone?.(selected);
            onClose();
        } catch (err) {
            setError(getErrorMessage(err, "Não foi possível salvar a classificação."));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            title="Classificar postagem"
            width={560}
            footer={
                <>
                    <Button variant="ghost" onClick={onClose} disabled={saving}>Cancelar</Button>
                    <Button variant="primary" onClick={save} disabled={saving || selected === current}>
                        {saving ? "Salvando..." : "Salvar"}
                    </Button>
                </>
            }
        >
            <div className={styles.options} role="radiogroup" aria-label="Classificação">
                {OPTIONS.map(({ value, label, hint, icon: Icon }) => (
                    <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={selected === value}
                        className={`${styles.option} ${selected === value ? styles.selected : ""}`}
                        onClick={() => setSelected(value)}
                    >
                        <Icon size={26} aria-hidden="true" />
                        <span>
                            <strong>{label}</strong>
                            <small>{hint}</small>
                        </span>
                    </button>
                ))}
            </div>
            {error && <p className={styles.error} role="alert">{error}</p>}
        </Dialog>
    );
}
