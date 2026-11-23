import { AppLayout } from "../../../components/Layout";
import { UserReportsTable } from "../ReportTables.jsx";

export default function UserReport() {
    return (
        <AppLayout title="Denúncias de usuários">
            <UserReportsTable />
        </AppLayout>
    );
}
