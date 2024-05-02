import dayjs from "dayjs";
import { DatePicker, Space } from "antd";

function MonthPickerComponent({ onChange, width = "100%" }) {
  return (
    <Space direction="vertical" size={12} style={{ width: width }}>
      <DatePicker picker="month" onChange={onChange} />
    </Space>
  );
}

export default MonthPickerComponent;
