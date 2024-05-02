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
    value: [dayjs().add(-7, "d"), dayjs()],
  },
  {
    label: "Últimas 2 semanas",
    value: [dayjs().add(-14, "d"), dayjs()],
  },
  {
    label: "Último mes",
    value: [dayjs().add(-30, "d"), dayjs()],
  },
  {
    label: "Últimos 3 meses",
    value: [dayjs().add(-90, "d"), dayjs()],
  },
];

function DatePickerComponent({ width, ...props }) {
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
        {...props}
      />
    </Space>
  );
}

export default DatePickerComponent;
