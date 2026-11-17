import styles from "./create-report-modal.module.css";
import { Input, Modal } from "antd";
import { useState } from "react";

const { TextArea } = Input;

export default function CreateReportModal({ id, onSubmit, icon, title, label }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [report, setReport] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    }

    const handleOk = async () => {
        setIsLoading(true);
        try {
            console.log("ENVIANDO REPORTTT")
            await onSubmit(id, report);
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handelCancel = () => {
        setIsModalOpen(false);
    }

    function onChange(e) {
        setReport(e.trim());
    }

    return (
        <>
            <div className={styles["report-wrapper"]} onClick={showModal}>
                { icon }
                <span>{ title }</span>
            </div>

            <Modal
                title={ label }
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handelCancel}
                loading={isLoading}
            >
                <TextArea
                    autoSize={{ minRows: 4, maxRows: 5 }}
                    maxLength={255}
                    placeholder="Elabore sua denúncia aqui"
                    onChange={(e) => onChange(e.target.value)}
                />
            </Modal>
        </>
    )
}