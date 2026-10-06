import { DatePicker, ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import dayjs from "dayjs";
import 'dayjs/locale/pt-br.js';

dayjs.locale('pt-br');

const {RangePicker} = DatePicker;

export default function Date({ onChange }) {
    return (
        <ConfigProvider locale={ptBR}>
            <RangePicker
                format="DD/MM/YYYY"
                onChange={onChange}
            />
        </ConfigProvider>
    )
}