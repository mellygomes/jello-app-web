import { useEffect, useMemo, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import Dialog from "../Dialog";
import Button from "../Button";
import TagSelect from "../Filter/TagSelect";
import { createPost } from "../../services";
import { getErrorMessage } from "../../lib/api.js";
import styles from "./create-post.module.css";

const MAX_IMAGES = 6;
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Janela "Criar novo post" (título, descrição, tags e imagens)
export default function CreatePostDialog({ open, onClose, onCreated }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [files, setFiles] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef(null);

    const previews = useMemo(
        () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
        [files]
    );

    // solta as URLs temporárias das prévias quando a lista muda ou a janela fecha
    useEffect(() => {
        return () => previews.forEach((item) => URL.revokeObjectURL(item.url));
    }, [previews]);

    const reset = () => {
        setTitle("");
        setContent("");
        setSelectedTags([]);
        setFiles([]);
        setError("");
    };

    const handleClose = () => {
        if (saving) return;
        reset();
        onClose();
    };

    const addFiles = (list) => {
        const incoming = Array.from(list ?? []);
        const valid = [];

        for (const file of incoming) {
            if (!ALLOWED.includes(file.type)) {
                setError("Use imagens JPG, PNG, WEBP ou GIF.");
                continue;
            }
            if (file.size > MAX_SIZE) {
                setError(`"${file.name}" passa de 5 MB.`);
                continue;
            }
            valid.push(file);
        }

        if (valid.length > 0) {
            setError("");
            setFiles((current) => [...current, ...valid].slice(0, MAX_IMAGES));
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            setError("Dê um título para o post.");
            return;
        }
        if (files.length === 0) {
            setError("Escolha pelo menos uma imagem.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const body = new FormData();
            files.forEach((file) => body.append("images", file));
            body.append("post", JSON.stringify({
                title: title.trim(),
                content: content.trim(),
                tagIds: selectedTags,
            }));

            const response = await createPost(body);
            reset();
            onCreated?.(response.data);
            onClose();
        } catch (err) {
            setError(getErrorMessage(err, "Não foi possível criar o post."));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            title="Criar novo post"
            width={800}
            footer={
                <>
                    <Button variant="ghost" onClick={handleClose} disabled={saving}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={saving}>
                        {saving ? "Criando..." : "Criar"}
                    </Button>
                </>
            }
        >
            <div className={styles.form}>
                <input
                    className={styles.input}
                    placeholder="Título..."
                    aria-label="Título"
                    maxLength={100}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />

                <div className={styles["area-wrap"]}>
                    <textarea
                        className={styles.textarea}
                        placeholder="Descrição..."
                        aria-label="Descrição"
                        maxLength={255}
                        rows={5}
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                    />
                    <span className={styles.counter}>{content.length}/255</span>
                </div>

                <TagSelect
                    value={selectedTags}
                    onChange={setSelectedTags}
                    placeholder="Procure por Tags"
                />

                <div
                    className={`${styles.drop} ${dragging ? styles.dragging : ""}`}
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(event) => {
                        event.preventDefault();
                        setDragging(false);
                        addFiles(event.dataTransfer.files);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && inputRef.current?.click()}
                >
                    <Upload size={30} aria-hidden="true" />
                    <span>Selecione ou arraste um arquivo</span>
                    <small>JPG, PNG, WEBP ou GIF · até 5 MB cada · máximo {MAX_IMAGES} imagens</small>
                    <input
                        ref={inputRef}
                        type="file"
                        accept={ALLOWED.join(",")}
                        multiple
                        hidden
                        onChange={(event) => {
                            addFiles(event.target.files);
                            event.target.value = "";
                        }}
                    />
                </div>

                {previews.length > 0 && (
                    <ul className={styles.previews}>
                        {previews.map(({ file, url }, index) => (
                            <li key={`${file.name}-${index}`}>
                                <img src={url} alt={file.name} />
                                <button
                                    type="button"
                                    onClick={() => setFiles((current) => current.filter((_, position) => position !== index))}
                                    aria-label={`Remover ${file.name}`}
                                >
                                    <X size={14} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {error && <p className={styles.error} role="alert">{error}</p>}
            </div>
        </Dialog>
    );
}
