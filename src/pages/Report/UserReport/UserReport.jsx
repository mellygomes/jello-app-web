import styles from "./user-report.module.css";
import { Sidebar } from "../../../components/index.js";
import { Modal, Space, Table, Tag, Tooltip } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { approveUserReport, getUsersReports, unapproveUserReport } from "../../../services";
import UserReportInfo from "./components/UserReportInfo/index.js";

export default function UserReport() {

    const [active, setActive] = useState("Início");
    const [reports, setReports] = useState([]);
    const [error, setError] = useState("");
    const [selectedReport, setSelectedReport] = useState(null);

    const changeReportStatus = async (reportId, approved) => {
        try {
            if (approved) {
                await approveUserReport(reportId);
            } else {
                await unapproveUserReport(reportId);
            }

            setReports((currentReports) =>
                currentReports.map((report) =>
                    report.id === reportId ? {...report, approved} : report
                )
            );
        } catch (error) {
            console.error(error);
            setError("Não foi possivel atualizar a situacao do report");
        }
    }

    useEffect(() => {
        let cancelado = false;

        getUsersReports()
            .then((response) => {
                if (!cancelado) setReports(response.data);
            })
            .catch((error) => {
                console.error(error);

                setError("Nao foi possivel carregar os reports");
            })

        return () => {
            cancelado = true;
        };
    }, []);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'userReporter',
            key: 'userReporter',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Conteúdo',
            dataIndex: 'content',
            key: 'content',
            width: 1000,
            render: content => <a>{ content }</a>
        },
        {
            title: 'Usuário Reportado',
            key: 'userReported',
            dataIndex: 'userReported',
            render: (_, report) =>
                <a style={{ color: "#4aa0ed" }} onClick={() => setSelectedReport(report)}>{ report.userReported.firstName }</a>
        },
        {
            title: "Situação",
            key: "approved",
            dataIndex: "approved",
            render: (approved) => (approved ?
                    <Tag color={"green"} variant={"outlined"}>Aprovado</Tag>
                    : <Tag color={"red"} variant={"outlined"}>Rejeitado</Tag>
            )
        },
        {
            title: 'Ações',
            key: 'action',
            render: (_, report) => (
                <Space size="medium">
                    <Tooltip placement="bottom" title="Reprovar">
                        <CloseCircleOutlined
                            onClick={() => changeReportStatus(report.id, false)}
                            style={{color: "red", fontSize: "20px"}}
                        />
                    </Tooltip>
                    <Tooltip placement="bottom" title="Aprovar">
                        <CheckCircleOutlined
                            onClick={() => changeReportStatus(report.id, true)}
                            style={{color: "#4CBB17", fontSize: "20px"}}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    console.log(reports);
    console.log(error);

    return (
        <div className={styles["container"]}>
            <Sidebar active={active} setActive={setActive}/>
            <div className={styles["report-content"]}>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={reports}
                    tableLayout={"auto"}
                />
                <Modal
                    title="Informações do Usuário Reportado"
                    open={selectedReport !== null}
                    onOk={() => setSelectedReport(null)}
                    onCancel={() => setSelectedReport(null)}
                    footer={<></>}
                >
                    { selectedReport && (
                        <UserReportInfo
                            name={ `${selectedReport.userReported.firstName} ${selectedReport.userReported.lastName}` }
                            username={ selectedReport.userReported.username }
                            bio={ selectedReport.userReported.bio }
                            email={ selectedReport.userReported.email }
                            userId={ selectedReport.reportedId }
                        />
                    ) }
                </Modal>
            </div>
        </div>
    );
}