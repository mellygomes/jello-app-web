import { submitUserReport } from "../services";

export function useUserReport() {

    async function submitReport(userId, report) {
        if (!userId) throw new Error("Usuário não informado");

        await submitUserReport({
            userReportedId: userId,
            content: report
        });
    }

    return { submitReport }
}
