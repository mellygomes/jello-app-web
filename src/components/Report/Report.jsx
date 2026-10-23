import { EllipsisOutlined, FlagFilled, InfoCircleOutlined, IssuesCloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import styles from "./report.module.css";
import CreateReportModal from "./CreateReportModal";

export default function Report() {

    const [showReport, setShowReport] = useState(false);

    return (
        <div>
            <EllipsisOutlined
                style={{ fontSize: "35px", cursor: "pointer" }}
                onClick={() => setShowReport(prev => !prev)}
             />

            <div className={`${styles.report} ${showReport ? styles["report-open"] : ""}`}>
                <div className={styles.options}>
                    <FlagFilled />
                    <span>Denunciar postagem</span>
                    <CreateReportModal />
                </div>
                <div className={styles.options}>
                    <IssuesCloseOutlined />
                    <span>Adicionar classificação</span>
                </div>
                <div className={styles.options}>
                    <InfoCircleOutlined />
                    <span>Bloquear @fernanda_lima</span>
                </div>
            </div>

        </div>
    )
}