import { DatePicker, ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import dayjs from "dayjs";
import 'dayjs/locale/pt-br.js';

dayjs.locale('pt-br');

const {RangePicker} = DatePicker;

export default function Date({ value, onChange }) {
    return (
        <ConfigProvider locale={ptBR}>
            <RangePicker
                format="DD/MM/YYYY"
                value={value}
                onChange={onChange}
            />
        </ConfigProvider>
    )
}