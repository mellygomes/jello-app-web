import { AppLayout } from "../../../components/Layout";
import { PostReportsTable } from "../ReportTables.jsx";

export default function PostReport() {
    return (
        <AppLayout title="Denúncias de postagens">
            <PostReportsTable />
        </AppLayout>
    );
}
