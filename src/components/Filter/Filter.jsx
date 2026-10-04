import styles from './filter.module.css';
import { Button, ToggleAI, TagSelect, Date } from "../index.js";
import { FilterFilled } from "@ant-design/icons";
import { useState } from "react";

export default function Filter() {

    const [showFilter, setShowFilter] = useState(false);

    return (
        <>
            <div className={styles["filter-container"]}>
                <div className={styles["filter-wrapper"]}>
                    <div className={styles["toggle-ai"]}>
                        <span>Filtrar I.A.</span>
                        <ToggleAI />
                    </div>
                    <div className={styles["filter-button"]}>
                        <FilterFilled
                            className={styles["filter-icon"]}
                            onClick={() => setShowFilter(prevState => !prevState)}
                        />
                        <Button>
                            Filtrar
                        </Button>
                    </div>
                </div>

                <div className={showFilter ? styles["filter-wrapper"] : styles["filter-wrapper-hidden"]} >
                    <div className={styles["filter-tags"]}>
                        <span>Tags</span>
                        <TagSelect />
                    </div>
                    <div className={styles["filter-date"]}>
                        <span>Data</span>
                        <Date/>
                    </div>
                </div>
            </div>
        </>
    );
}