import {Switch, Tooltip} from "antd";

export default function ToggleAI({ value, onChange }) {
    return (
        <Tooltip title="Posts classificados como I.A. por um moderador ficam escondidos até você ativar">
            <Switch
                value={value}
                onChange={onChange}
            />
        </Tooltip>
    )
}