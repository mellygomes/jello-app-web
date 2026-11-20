import { EllipsisOutlined, InfoCircleOutlined, FlagFilled } from "@ant-design/icons";
import { useState } from "react";
import styles from "./report-options.module.css";
import CreateReportModal from "./CreateReportModal";
import { usePostReport, useUserReport } from "../../hooks";

export default function ReportOptions({ postId, userId }) {

    const [showReport, setShowReport] = useState(false);
    const { submitReport: createPostReport } = usePostReport();
    const { submitReport: createUserReport } = useUserReport();

    return (
        <div>
            <EllipsisOutlined
                style={{ fontSize: "35px", cursor: "pointer" }}
                onClick={() => setShowReport(prev => !prev)}
            />

            <div className={`${styles.report} ${showReport ? styles["report-open"] : ""}`}>
                <div className={styles.options}>
                    <CreateReportModal
                        id={postId}
                        onSubmit={createPostReport}
                        icon={<FlagFilled />}
                        title="Denunciar essa postagem"
                        label="Denúncia de Postagem"
                    />
                </div>
                <div className={styles.options}>
                    <CreateReportModal
                        id={userId}
                        onSubmit={createUserReport}
                        icon={<InfoCircleOutlined />}
                        title="Denunciar esse usuário"
                        label="Denúncia de Usuário"
                    />
                </div>
                {/*<div className={styles.options}>*/}
                {/*    <IssuesCloseOutlined />*/}
                {/*    <span>Adicionar classificação</span>*/}
                {/*</div>*/}
            </div>

        </div>
    )
}