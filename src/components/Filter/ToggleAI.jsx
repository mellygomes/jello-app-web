import { Switch } from "antd";

export default function ToggleAI() {
    const onChange = checked => {
        console.log(`switch to ${checked}`);
    };
    return (
        <Switch onChange={onChange} />
    )
}