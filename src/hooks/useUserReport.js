import { useState } from "react";
import { submitUserReport } from "../services";

export function useUserReport() {

    const [error, setError] = useState("");

    async function submitReport(userId, report) {
        console.log("submitReport", userId, report);
        if (!userId) {
            console.warn("userId ausente meu dog, ja avisei que vai dar merda isso aqui");
            return;
        }

        try {
            await submitUserReport({
                userReportedId: userId,
                content: report
            });
        } catch (error) {
            setError(error);
            throw error;
        }
    }

    return { submitReport, error }
}
