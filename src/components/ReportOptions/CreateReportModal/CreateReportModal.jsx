import styles from "./create-report-modal.module.css";
import { Input, Modal } from "antd";
import { useState } from "react";
import { FlagFilled } from "@ant-design/icons";
import { usePostReport } from "../../../hooks";

const { TextArea } = Input;

export default function CreateReportModal({ postId }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { submitReport } = usePostReport();
    const [report, setReport] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    }

    const handleOk = async () => {
        setIsLoading(true);
        try {
            console.log("ENVIANDO REPORTTT")
            await submitReport(postId, report);
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
                <FlagFilled />
                <span>Denunciar postagem</span>
            </div>

            <Modal
                title="Denúncia de Postagem"
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