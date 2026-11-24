import { useState } from "react";
import Dialog from "../../Dialog";
import Button from "../../Button";
import { getErrorMessage } from "../../../lib/api.js";
import styles from "./create-report-modal.module.css";

// Janela de denúncia (serve pra post e pra usuário)
export default function CreateReportModal({ open, onClose, id, onSubmit, title }) {

    const [report, setReport] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    const handleClose = () => {
        setReport("");
        setError("");
        setSent(false);
        onClose();
    };

    const handleOk = async () => {
        if (report.trim().length < 5) {
            setError("Conte um pouco mais sobre o motivo (mínimo 5 caracteres).");
            return;
        }

        setIsLoading(true);
        setError("");
        try {
            await onSubmit(id, report.trim());
            setSent(true);
        } catch (err) {
            setError(getErrorMessage(err, "Não foi possível enviar a denúncia."));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            title={title}
            width={560}
            footer={
                sent ? (
                    <Button variant="primary" onClick={handleClose}>Fechar</Button>
                ) : (
                    <>
                        <Button variant="ghost" onClick={handleClose} disabled={isLoading}>Cancelar</Button>
                        <Button variant="primary" onClick={handleOk} disabled={isLoading}>
                            {isLoading ? "Enviando..." : "Enviar denúncia"}
                        </Button>
                    </>
                )
            }
        >
            {sent ? (
                <p className={styles.thanks}>Denúncia enviada! Um moderador vai analisar com calma.</p>
            ) : (
                <>
                    <textarea
                        className={styles.textarea}
                        rows={5}
                        maxLength={255}
                        placeholder="Elabore sua denúncia aqui"
                        value={report}
                        onChange={(event) => setReport(event.target.value)}
                        aria-label="Motivo da denúncia"
                    />
                    <span className={styles.counter}>{report.length}/255</span>
                    {error && <p className={styles.error} role="alert">{error}</p>}
                </>
            )}
        </Dialog>
    )
}
