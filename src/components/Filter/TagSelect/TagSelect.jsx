import { Select, Tag } from "antd";
import { useTags } from "../../../hooks";

export default function TagSelect({ onChange, value, placeholder = "Selecione as tags" }) {

    const {tags} = useTags();

    const selectOptions = tags.map((tag) => ({
        label: tag.name,
        value: tag.id,
        color: tag.color,
    }));

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
            placeholder={placeholder}
            style={{width: '100%'}}
            options={selectOptions}
            optionFilterProp="label"
            onChange={onChange}
            value={value}
        />
    );
}
