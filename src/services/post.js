import { api } from "../lib/api";

export function getMyPortfolioPosts(page = 0, size = 12) {
  return api.get("/api/v1/posts/portfolio", {
    params: { page, size },
  });
}