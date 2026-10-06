import { Select, Tag } from "antd";
import { getTags } from "../../services/filter.js";
import { useEffect, useState } from "react";

export default function TagSelect({onChange}) {

    const [tags, setTags] = useState([]);

    const selectOptions = tags.map((tag) => ({
        label: tag.name,
        value: tag.id,
        color: tag.color,
    }));

    useEffect(() => {
        async function loadTags() {
            try {
                const response = await getTags();
                setTags(response.data.data);
            } catch (error) {
                console.log(error);
            }
        }

        loadTags();
    }, []);

    const tagRender = (props) => {
        const {label, value, closable, onClose} = props;
        const tagData = selectOptions.find((opt) => opt.value === value);
        const color = tagData ? tagData.color : undefined;

        return (
            <Tag
                key={value}
                color={color}
                closable={closable}
                onClose={onClose}
                style={{marginInlineEnd: 4}}
            >
                {label}
            </Tag>
        );
    };

    return (
        <Select
            mode="multiple"
            tagRender={tagRender}
            placeholder="Selecione as tags"
            style={{width: '100%'}}
            options={selectOptions}
            onChange={onChange}
        />
    );
}