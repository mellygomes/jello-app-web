import { api } from "../lib/api.js";

export function getTags() {
    return api.get("/api/v1/tags");
}

export function submitFilter(body) {
    return api.get("/api/v1/posts/list", {params: body});
}