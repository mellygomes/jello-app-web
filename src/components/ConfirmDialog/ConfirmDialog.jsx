import Dialog from "../Dialog";
import Button from "../Button";

// Pergunta "tem certeza?" antes de ações pesadas (banir, excluir...)
export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Confirmar", danger = false, loading = false }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            title={title}
            width={520}
            footer={
                <>
                    <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
                    <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} disabled={loading}>
                        {loading ? "Aguarde..." : confirmLabel}
                    </Button>
                </>
            }
        >
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.4 }}>{message}</p>
        </Dialog>
    );
}
