import React, { useEffect, useRef } from "react";
import { Select, Input } from "antd";

const { Option } = Select;

const OrderBasicInfo = ({
  formData,
  setFormData,
  availableTables,
  fetchAvailableTables,
}) => {
  const hasInitialized = useRef(false);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Tự động đặt end_time = start_time + 1 giờ nếu end_time chưa có
      if (field === "start_time" && value && !newData.end_time) {
        const [hours, minutes] = value.split(":");
        const newHours = (parseInt(hours) + 1) % 24; // Cộng 1 giờ, không vượt quá 24
        newData.end_time = `${newHours.toString().padStart(2, "0")}:${minutes}`;
      }

      // Gọi fetchAvailableTables khi đủ thông tin
      if (newData.date && newData.start_time && newData.end_time) {
        fetchAvailableTables(newData.date, newData.start_time, newData.end_time);
      }

      return newData;
    });
  };

  useEffect(() => {
    if (!hasInitialized.current && Object.keys(formData).length === 0) {
      const now = new Date();
      const date = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()}`;
      const start_time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      setFormData({ date, start_time });
      hasInitialized.current = true;
    }
  }, [formData, setFormData]);

  return (
    <div>
      <h3>Thông tin cơ bản</h3>
      <div style={{ marginBottom: "16px" }}>
        <label>
          Loại Đơn Hàng <span style={{ color: "red" }}>*</span>
        </label>
        <Select
          value={formData.type}
          onChange={(value) => handleChange("type", value)}
          style={{ width: "100%", marginTop: "8px" }}
        >
          <Option value="reservation">Đặt Chỗ</Option>
          <Option value="ship">Giao Hàng</Option>
        </Select>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label>
          Trạng Thái <span style={{ color: "red" }}>*</span>
        </label>
        <Select
          value={formData.status}
          onChange={(value) => handleChange("status", value)}
          style={{ width: "100%", marginTop: "8px" }}
        >
          <Option value="pending">Pending</Option>
          <Option value="confirmed">Confirmed</Option>
          <Option value="completed">Completed</Option>
          <Option value="canceled">Canceled</Option>
        </Select>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label>
          Ngày <span style={{ color: "red" }}>*</span>
        </label>
        <Input
          value={formData.date}
          placeholder="DD/MM/YYYY"
          onChange={(e) => handleChange("date", e.target.value)}
          style={{ width: "100%", marginTop: "8px" }}
        />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label>
          Thời Gian Bắt Đầu <span style={{ color: "red" }}>*</span>
        </label>
        <Input
          value={formData.start_time}
          placeholder="HH:mm"
          onChange={(e) => handleChange("start_time", e.target.value)}
          style={{ width: "100%", marginTop: "8px" }}
        />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label>
          Thời Gian Kết Thúc <span style={{ color: "red" }}>*</span>
        </label>
        <Input
          value={formData.end_time}
          placeholder="HH:mm"
          onChange={(e) => handleChange("end_time", e.target.value)}
          style={{ width: "100%", marginTop: "8px" }}
        />
      </div>
      {formData.type === "reservation" && (
        <div style={{ marginBottom: "16px" }}>
          <label>
            Chọn Bàn <span style={{ color: "red" }}>*</span>
          </label>
          <Select
            mode="multiple"
            value={formData.tables}
            onChange={(value) => handleChange("tables", value)}
            placeholder="Chọn bàn"
            style={{ width: "100%", marginTop: "8px" }}
          >
            {availableTables.map((table) => (
              <Select.Option
                key={table.table_number}
                value={table.table_number}
              >
                Bàn {table.table_number} (Sức chứa: {table.capacity})
              </Select.Option>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
};

export default OrderBasicInfo;