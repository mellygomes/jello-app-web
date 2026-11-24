import { submitPostReport } from "../services";

export function usePostReport() {

    async function submitReport(postId, report) {
        if (!postId) throw new Error("Post não informado");

        await submitPostReport({
            postId: postId,
            content: report
        });
    }

    return { submitReport };
}
