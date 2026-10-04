import { Select, Tag } from "antd";

export default function TagSelect() {

    const options = [{value: 'gold'}, {value: 'lime'}, {value: 'green'}];

    const tagRender = props => {
        const {label, value, closable, onClose} = props;
        const onPreventMouseDown = event => {
            event.preventDefault();
            event.stopPropagation();
        };

        return (
            <Tag
                color={value}
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                style={{marginInlineEnd: 4}}
            >
                {label}
            </Tag>
        );
    };

    const handleChange = value => {
        console.log(`selected ${value}`);
    }

    return (
        <Select
            mode="multiple"
            tagRender={tagRender}
            defaultValue={['gold', 'lime']}
            placeholder="Tags"
            style={{width: '100%'}}
            onChange={handleChange}
            options={options}
        />
    );
}