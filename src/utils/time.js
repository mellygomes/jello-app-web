import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br.js";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

// "há 14 minutos", "há 2 horas"...
export function timeAgo(date) {
    if (!date) return "";
    return dayjs(date).fromNow();
}

export function formatDate(date) {
    if (!date) return "";
    return dayjs(date).format("DD [de] MMMM [de] YYYY");
}

// 232000 -> "232 mil"
export function compactNumber(value = 0) {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(".0", "")} mi`;
    if (value >= 1000) return `${Math.floor(value / 1000)} mil`;
    return String(value);
}
