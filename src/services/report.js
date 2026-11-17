import { api } from "../lib/api.js";

export function submitPostReport(body) {
    return api.post("/api/v1/posts/reports/create", body);
}

export function submitUserReport(body) {
    return api.post("/api/v1/users/reports/create", body);
}

export function getAllPostReports() {
    return api.get("/api/v1/posts/reports");
}

export function getPostsReports() {
    return api.get("/api/v1/posts/reports/list");
}

export function approvePostReport(reportId) {
    return api.put(`/api/v1/posts/reports/approve/${reportId}`);
}

export function unapprovePostReport(reportId) {
    return api.put(`/api/v1/posts/reports/unapprove/${reportId}`);
}

export function getUsersReports() {
    return api.get("/api/v1/users/reports/list");
}

export function approveUserReport(reportId) {
    return api.put(`/api/v1/users/reports/approve/${reportId}`);
}

export function unapproveUserReport(reportId) {
    return api.put(`/api/v1/users/reports/unapprove/${reportId}`);
}
