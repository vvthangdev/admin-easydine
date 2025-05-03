import React, { useEffect, useState } from "react";
import { Select, Input } from "antd";
import moment from "moment";
import { userAPI } from "../../../services/apis/User";

const { Option } = Select;

const OrderBasicInfo = ({
  formData,
  setFormData,
  availableTables,
  fetchAvailableTables,
}) => {
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  // Lấy danh sách nhân viên khi component mount
  useEffect(() => {
    const fetchStaffList = async () => {
      setLoadingStaff(true);
      try {
        const response = await userAPI.getAllUser();
        const users = response.data || response; // Giả định API trả về danh sách users
        setStaffList(users);
      } catch (error) {
        console.error("Error fetching staff list:", error);
        setStaffList([]);
      } finally {
        setLoadingStaff(false);
      }
    };
    fetchStaffList();
  }, []);

  const handleChange = (field, value) => {
    console.log(`Changing ${field} to:`, value); // Thêm log để debug
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      if (newData.date && newData.start_time) {
        const isValidDate = moment(newData.date, "DD/MM/YYYY", true).isValid();
        const isValidStartTime = moment(
          newData.start_time,
          "HH:mm",
          true
        ).isValid();
        if (!isValidDate || !isValidStartTime) {
          console.error("Invalid date or start time format");
          return newData;
        }

        const startDateTime = moment(
          `${newData.date} ${newData.start_time}`,
          "DD/MM/YYYY HH:mm"
        ).utc();
        const endDateTime = newData.end_time
          ? moment(
              `${newData.date} ${newData.end_time}`,
              "DD/MM/YYYY HH:mm"
            ).utc()
          : moment(`${newData.date} ${newData.start_time}`, "DD/MM/YYYY HH:mm")
              .add(1, "hours")
              .utc();

        if (!endDateTime.isValid()) {
          console.error("Invalid end time format");
          return newData;
        }

        fetchAvailableTables(
          newData.date,
          startDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"), // Thêm [Z] để chuẩn hóa UTC
          endDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]")
        );
      }

      return newData;
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4">
      <h3 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <div className="min-w-0">
          <label className="text-sm font-medium text-gray-900">
            Loại Đơn Hàng <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.type || "reservation"}
            onChange={(value) => handleChange("type", value)}
            className="w-full mt-2"
            popupClassName="border-gray-300 rounded-lg"
          >
            <Option value="reservation">Đặt Chỗ</Option>
            <Option value="ship">Giao Hàng</Option>
          </Select>
        </div>
        <div className="min-w-0">
          <label className="text-sm font-medium text-gray-900">
            Trạng Thái <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.status || "pending"}
            onChange={(value) => handleChange("status", value)}
            className="w-full mt-2"
            popupClassName="border-gray-300 rounded-lg"
          >
            <Option value="pending">Pending</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="completed">Completed</Option>
            <Option value="canceled">Canceled</Option>
          </Select>
        </div>
        <div className="min-w-0">
          <label className="text-sm font-medium text-gray-900">
            Nhân Viên Phụ Trách
          </label>
          <Select
            value={formData.staff_id || undefined}
            onChange={(value) => handleChange("staff_id", value)}
            placeholder="Chọn nhân viên"
            className="w-full mt-2"
            popupClassName="border-gray-300 rounded-lg"
            loading={loadingStaff}
            allowClear
          >
            {staffList.map((staff) => (
              <Option key={staff._id} value={staff._id}>
                {staff.username || staff.name || "Không xác định"}
              </Option>
            ))}
          </Select>
        </div>
        <div className="min-w-0">
          <label className="text-sm font-medium text-gray-900">
            Ngày <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.date || ""}
            placeholder="DD/MM/YYYY"
            onChange={(e) => handleChange("date", e.target.value)}
            className="w-full mt-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="min-w-0">
          <label className="text-sm font-medium text-gray-900">
            Thời Gian Bắt Đầu <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.start_time || ""}
            placeholder="HH:mm"
            onChange={(e) => handleChange("start_time", e.target.value)}
            className="w-full mt-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="min-w-0">
          <label className="text-sm font-medium text-gray-900">
            Thời Gian Kết Thúc
          </label>
          <Input
            value={formData.end_time || ""}
            placeholder="HH:mm"
            onChange={(e) => handleChange("end_time", e.target.value)}
            className="w-full mt-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {formData.type === "reservation" && (
          <div className="sm:col-span-2 min-w-0">
            <label className="text-sm font-medium text-gray-900">
              Chọn Bàn
            </label>
            <Select
              mode="multiple"
              value={formData.tables || []}
              onChange={(value) => handleChange("tables", value)}
              placeholder="Chọn bàn"
              className="w-full mt-2"
              popupClassName="border-gray-300 rounded-lg"
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
