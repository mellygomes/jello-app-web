import { Select } from "antd";
import TagSelect from "./TagSelect";
import ToggleAI from "./ToggleAi";
import styles from "./tag-filter-bar.module.css";

const SORT_OPTIONS = [
    { value: "RECENT", label: "Mais recentes" },
    { value: "POPULAR", label: "Mais curtidos" },
    { value: "COMMENTED", label: "Mais comentados" },
    { value: "OLDEST", label: "Mais antigos" },
];

// Linha de filtros do Explorar e dos perfis: mostrar I.A., ordenação e seletor de tags
export default function TagFilterBar({ filter, onChange }) {
    return (
        <div className={styles.bar}>
            <div className={styles.row}>
                <label className={styles.toggle} title="Posts classificados como I.A. por um moderador ficam escondidos até você ligar">
                    <span>Mostrar I.A.</span>
                    <ToggleAI
                        value={Boolean(filter.showAi)}
                        onChange={(value) => onChange("showAi", value)}
                    />
                </label>

                <label className={styles.sort}>
                    <span>Ordenar por</span>
                    <Select
                        value={filter.sort ?? "RECENT"}
                        options={SORT_OPTIONS}
                        onChange={(value) => onChange("sort", value)}
                        style={{ minWidth: 170 }}
                        aria-label="Ordenar posts"
                    />
                </label>
            </div>

            <TagSelect
                value={filter.tags}
                onChange={(value) => onChange("tags", value)}
            />
        </div>
    );
}
