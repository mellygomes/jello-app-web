import styles from './filter.module.css';
import { Button, ToggleAI, TagSelect, Date } from "../index.js";
import { FilterFilled } from "@ant-design/icons";
import { useState } from "react";
import { Input } from "antd";
import { submitFilter } from "../../services/filter.js";
import dayjs from "dayjs";


export default function Filter() {

    const [showFilter, setShowFilter] = useState(false);
    const [toggleFilterAi, setToggleFilterAi] = useState(false);
    const [inputSearch, setInputSearch] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedDate, setSelectedDate] = useState([]);

    const onChangeToggle = (checked) => {
        setToggleFilterAi(checked);
    };

    const onChangeSearch = (e) => {
        setInputSearch(e.target.value);
    };

    const onChangeTagSelect = (value) => {
        setSelectedTags(value);
    };

    const onChangeDate = (date) => {
        setSelectedDate(date);
    };

    async function handleFilter() {
        try {
            const filterAi = toggleFilterAi;
            const tags = selectedTags;
            const initialDate = selectedDate?.[0] ? dayjs(selectedDate[0]).format("YYYY-MM-DD") : null;
            const finalDate = selectedDate?.[1] ? dayjs(selectedDate[1]).format("YYYY-MM-DD") : null;
            const search = inputSearch;

            const filterData = {
                filterAi,
                tags,
                initialDate,
                finalDate,
                search
            };

            const response = await submitFilter(filterData);

            // const posts = response.data.data;
            // Mudar essa bomba ai quando for inserir o filtro no feed principal
            // os posts retornados estao dentro do response.data.data
            // Usar como quiser e ser feliz com o retorno dos posts
            console.log("resposta: ", response);
        } catch (error) {
            console.log("Deu erro meu doggus: ", error);
        }
    }

    return (
        <>
            <div className={styles["filter-container"]}>
                <div className={styles["filter-wrapper"]}>

                    <div className={styles["toggle-ai"]}>
                        <span>Filtrar I.A.</span>
                        <ToggleAI
                            onChange={onChangeToggle}
                        />
                    </div>

                    <Input
                        placeholder="O que você procura?"
                        onChange={onChangeSearch}
                        style={{ width: '30rem', height: '100%' }}
                    />

                    <div className={styles["filter-button"]}>
                        <FilterFilled
                            className={styles["filter-icon"]}
                            onClick={() => setShowFilter(prevState => !prevState)}
                        />
                        <Button
                            onClick={handleFilter}
                        >
                            Filtrar
                        </Button>
                    </div>

                </div>

                <div className={showFilter ? styles["filter-wrapper"] : styles["filter-wrapper-hidden"]} >
                    <div className={styles["filter-tags"]}>
                        <span>Tags</span>
                        <TagSelect
                            onChange={onChangeTagSelect}
                        />
                    </div>
                    <div className={styles["filter-date"]}>
                        <span>Data</span>
                        <Date
                            onChange={onChangeDate}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}