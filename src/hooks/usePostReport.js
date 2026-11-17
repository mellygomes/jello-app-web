import { useState } from "react";
import { submitPostReport } from "../services";

export function usePostReport() {

    const [error, setError] = useState("");

    async function submitReport(postId, report) {
        console.log("submitReport", postId, report);
        if (!postId) {
            console.warn("postId ausente meu dog, ja avisei que vai dar merda isso aqui");
            return;
        }

        try {
            await submitPostReport({
                postId: postId,
                content: report
            });
        } catch (error) {
            setError(error);
            throw error;
        }
    }

    return { submitReport, error };
}
