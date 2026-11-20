import { Switch } from "antd";

export default function ToggleAI({ value, onChange }) {
    return (
        <Switch
            value={value}
            onChange={onChange}
        />
    )
}