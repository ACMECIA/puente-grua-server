import dayjs from "dayjs";
import { DatePicker, Space } from "antd";

const { RangePicker } = DatePicker;

const rangePresets = [
  //   {
  //     label: 'Today',
  //     value: [dayjs(), dayjs().endOf('day')],
  //   },
  {
    label: "Última semana",
    value: [dayjs().startOf("day").add(-7, "d"), dayjs().endOf("day")],
  },
  {
    label: "Últimas 2 semanas",
    value: [dayjs().startOf("day").add(-14, "d"), dayjs().endOf("day")],
  },
  {
    label: "Último mes",
    value: [dayjs().startOf("day").add(-30, "d"), dayjs().endOf("day")],
  },
  {
    label: "Últimos 3 meses",
    value: [dayjs().startOf("day").add(-90, "d"), dayjs().endOf("day")],
  },
];

function DatePickerComponent({ onRangeChange, width = "100%" }) {
  return (
    <Space direction="vertical" size={12} style={{ width: width }}>
      <RangePicker
        presets={[
          {
            label: <span aria-label="Current Time to End of Day">Hoy</span>,
            // value: () => [dayjs(), dayjs().endOf('day')], // 5.8.0+ support function
            // value del inicio del dia hasta ahora
            value: () => [dayjs().startOf("day"), dayjs().endOf("day")], // 5.8.0+ support function
          },
          ...rangePresets,
        ]}
        showTime
        format="DD/MM/YYYY HH:mm:ss"
        onChange={onRangeChange}
      />
    </Space>
  );
}

export default DatePickerComponent;
