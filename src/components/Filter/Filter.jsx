import styles from './filter.module.css';
import aiIcon from "../../assets/icons/ai-icon.png";
import { Button, Date, FilterPic, TagSelect, ToggleAI } from "../index.js";
import { ClearOutlined, FilterFilled } from "@ant-design/icons";
import { useState } from "react";
import { Input } from "antd";

export default function Filter({isIconDisplay, filter, onChange, onReset, onSearch}) {

    const [showFilter, setShowFilter] = useState(false);

    return (
        <>
            <div className={styles["filter-container"]}>
                <div className={styles["filter-wrapper"]}>

                    <div className={styles["toggle-ai"]}>
                        <img className={styles["ai-icon"]} src={aiIcon} alt="ícone de IA."/>
                        <ToggleAI
                            value={filter.filterAi}
                            onChange={(e) => onChange("filterAi", e)}
                        />
                    </div>

                    <Input
                        placeholder="O que você procura?"
                        value={filter.search}
                        onChange={(e) => onChange("search", e.target.value)}
                        style={{width: '30rem', height: '100%'}}
                    />

                    <div className={styles["filter-button"]}>
                        <FilterFilled
                            className={styles["filter-icon"]}
                            onClick={() => setShowFilter(prevState => !prevState)}
                        />
                        {isIconDisplay ?
                            <FilterPic
                                onClick={onSearch}
                            />
                            :
                            <Button
                                onClick={onSearch}
                            >
                                Filtrar
                            </Button>
                        }
                        <ClearOutlined onClick={onReset} />
                    </div>

                </div>

                <div className={showFilter ? styles["filter-wrapper"] : styles["filter-wrapper-hidden"]}>
                    <div className={styles["filter-tags"]}>
                        <span>Tags</span>
                        <TagSelect
                            value={filter.tags}
                            onChange={(value) => onChange("tags", value)}
                        />
                    </div>
                    <div className={styles["filter-date"]}>
                        <span>Data</span>
                        <Date
                            value={filter.date}
                            onChange={(value) => onChange("date", value)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}