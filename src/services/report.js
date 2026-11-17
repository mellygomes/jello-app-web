import { api } from "../lib/api.js";

export function submitPostReport(body) {
    return api.post("/api/v1/posts/reports/create", body);
}

export function getAllPostReports() {
    return api.get("/api/v1/posts/reports/list");
}

export function getInfo() {
    return api.get("/api/v1/posts/reports/teste");
}

export function approveReport(reportId) {
    return api.put(`/api/v1/posts/reports/approve/${reportId}`);
}

export function unapproveReport(reportId) {
    return api.put(`/api/v1/posts/reports/unapprove/${reportId}`);
}
