import styles from "./create-report-modal.module.css";
import { Modal } from "antd";
import { useState } from "react";
import { FlagFilled } from "@ant-design/icons";

export default function CreateReportModal() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    }

    const handleOk = () => {
        console.log("handle ok")
        setIsModalOpen(false);
    }

    const handelCancel = () => {
        console.log("handle cancel")
        setIsModalOpen(false);
    }

    return (
        <>
            <div onClick={showModal}>
                <FlagFilled />
                <span>Denunciar postagem</span>
            </div>
            <CreateReportModal
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handelCancel}
            />
            <Modal
                title="Basic Modal"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handelCancel}
            >
                <p className={styles}>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </>
    )
}