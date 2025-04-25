import React, { useEffect, useRef } from "react";
import { Select, Input } from "antd";
import moment from "moment";

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

      if (field === "start_time" && value && !newData.end_time) {
        const [hours, minutes] = value.split(":");
        const newHours = (parseInt(hours) + 1) % 24;
        newData.end_time = `${newHours.toString().padStart(2, "0")}:${minutes}`;
      }

      if (newData.date && newData.start_time && newData.end_time) {
        fetchAvailableTables(newData.date, newData.start_time, newData.end_time);
      }

      return newData;
    });
  };

  useEffect(() => {
    if (!hasInitialized.current && Object.keys(formData).length === 0) {
      const now = moment().utc();
      const date = now.format("DD/MM/YYYY");
      const start_time = now.format("HH:mm");
      setFormData({ date, start_time });
      hasInitialized.current = true;
    }
  }, [formData, setFormData]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <h3 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-900">
            Loại Đơn Hàng <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.type}
            onChange={(value) => handleChange("type", value)}
            className="w-full mt-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <Option value="reservation">Đặt Chỗ</Option>
            <Option value="ship">Giao Hàng</Option>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-900">
            Trạng Thái <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.status}
            onChange={(value) => handleChange("status", value)}
            className="w-full mt-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <Option value="pending">Pending</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="completed">Completed</Option>
            <Option value="canceled">Canceled</Option>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-900">
            Thời Gian Kết Thúc <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.end_time}
            placeholder="HH:mm"
            onChange={(e) => handleChange("end_time", e.target.value)}
            className="w-full mt-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-900">
            Ngày <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.date}
            placeholder="DD/MM/YYYY"
            onChange={(e) => handleChange("date", e.target.value)}
            className="w-full mt-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-900">
            Thời Gian Bắt Đầu <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.start_time}
            placeholder="HH:mm"
            onChange={(e) => handleChange("start_time", e.target.value)}
            className="w-full mt-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {formData.type === "reservation" && (
          <div className="col-span-3">
            <label className="text-sm font-medium text-gray-900">
              Chọn Bàn <span className="text-red-500">*</span>
            </label>
            <Select
              mode="multiple"
              value={formData.tables}
              onChange={(value) => handleChange("tables", value)}
              placeholder="Chọn bàn"
              className="w-full mt-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
    </div>
  );
};

export default OrderBasicInfo;