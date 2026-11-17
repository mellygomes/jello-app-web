import styles from "./post-report.module.css";
import { Table, Space, Tooltip, Tag, Modal } from 'antd';
import { useEffect, useState } from "react";
import { Sidebar } from "../../../components/index.js";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { approvePostReport, getPostsReports, unapprovePostReport } from "../../../services/index.js";
import PostReportInfo from "./components/PostReportInfo";

export default function PostReport() {

    const changeReportStatus = async (reportId, approved) => {
        try {
            if (approved) {
                await approvePostReport(reportId);
            } else {
                await unapprovePostReport(reportId);
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

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Conteúdo',
            dataIndex: 'reportContent',
            key: 'reportContent',
            width: 1000,
            render: content => <a>{ content }</a>
        },
        {
            title: 'Postagem',
            key: 'post',
            dataIndex: 'post',
            render: (_, report) =>
                <a style={{ color: "#4aa0ed" }} onClick={() => setSelectedReport(report)}>{ report.post }</a>
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

    const [active, setActive] = useState("Início");
    const [reports, setReports] = useState([]);
    const [error, setError] = useState("");
    const [selectedReport, setSelectedReport] = useState(null);

    console.log(error);

    useEffect(() => {
        let cancelado = false;

        getPostsReports()
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

    console.log(reports);

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
                    title="Informações da Postagem"
                    open={selectedReport !== null}
                    onOk={() => setSelectedReport(null)}
                    onCancel={() => setSelectedReport(null)}
                    footer={<></>}
                >
                    { selectedReport && (
                        <PostReportInfo
                            title={ selectedReport.post }
                            content={ selectedReport.postContent }
                            images={ selectedReport.images }
                        />
                    ) }
                </Modal>
            </div>
        </div>
    )
}
