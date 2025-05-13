import React, { useEffect, useState } from "react";
import { Select, Input, Tabs } from "antd";
import moment from "moment";
import { userAPI } from "../../services/apis/User";

const { Option } = Select;
const { TabPane } = Tabs;

const OrderBasicInfo = ({
  formData,
  setFormData,
  availableTables,
  fetchAvailableTables,
}) => {
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  useEffect(() => {
    const fetchStaffList = async () => {
      setLoadingStaff(true);
      try {
        const users = await userAPI.getAllUser();
        setStaffList(Array.isArray(users) ? users : []);
      } catch (error) {
        console.error("Error fetching staff list:", error);
        setStaffList([]);
      } finally {
        setLoadingStaff(false);
      }
    };
    fetchStaffList();
  }, []);

  // Nhóm bàn theo tầng (area)
  const groupedTables = availableTables.reduce((acc, table) => {
    const area = table.area || "Không xác định";
    if (!acc[area]) {
      acc[area] = [];
    }
    acc[area].push(table);
    return acc;
  }, {});

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Đặt end_time mặc định là 23:59
      newData.end_time = "23:59";

      if (newData.date && newData.start_time) {
        const isValidDate = moment(newData.date, "DD/MM/YYYY", true).isValid();
        const isValidStartTime = moment(newData.start_time, "HH:mm", true).isValid();
        if (!isValidDate || !isValidStartTime) {
          console.error("Invalid date or start time format");
          return newData;
        }

        const startDateTime = moment(
          `${newData.date} ${newData.start_time}`,
          "DD/MM/YYYY HH:mm"
        ).utc();
        const endDateTime = moment(
          `${newData.date} 23:59`,
          "DD/MM/YYYY HH:mm"
        ).utc();

        if (!endDateTime.isValid()) {
          console.error("Invalid end time format");
          return newData;
        }

        fetchAvailableTables(
          newData.date,
          startDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
          endDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]")
        );
      }

      return newData;
    });
  };

  const handleTableChange = (area, value) => {
    // Tạo key duy nhất cho bàn dựa trên area và table_number
    const selectedTableIds = value.map((tableKey) => {
      const [tableNumber, tableArea] = tableKey.split("|");
      const table = availableTables.find(
        (t) => t.table_number === parseInt(tableNumber) && t.area === tableArea
      );
      return table ? table._id : null;
    }).filter((id) => id !== null);

    // Cập nhật danh sách bàn được chọn, giữ lại các bàn từ các area khác
    setFormData((prev) => {
      const otherAreaTableIds = prev.tables.filter((tableId) => {
        const table = availableTables.find((t) => t._id === tableId);
        return table && table.area !== area;
      });
      return {
        ...prev,
        tables: [...otherAreaTableIds, ...selectedTableIds],
      };
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
            className="w-full mt-2 border-2 border-blue-500 rounded-lg shadow-md"
            popupClassName="border-gray-300 rounded-lg"
            style={{ fontWeight: "bold", color: "#1E40AF" }}
          >
            <Option value="pending" style={{ color: "#D97706" }}>
              Pending
            </Option>
            <Option value="confirmed" style={{ color: "#059669" }}>
              Confirmed
            </Option>
            <Option value="completed" style={{ color: "#1E40AF" }}>
              Completed
            </Option>
            <Option value="canceled" style={{ color: "#DC2626" }}>
              Canceled
            </Option>
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
        {formData.type === "reservation" && (
          <div className="sm:col-span-2 min-w-0">
            <label className="text-sm font-medium text-gray-900">
              Chọn Bàn
            </label>
            <Tabs defaultActiveKey="Tầng 1" className="mt-2">
              {Object.keys(groupedTables).map((area) => (
                <TabPane tab={area} key={area}>
                  <Select
                    mode="multiple"
                    value={
                      formData.tables
                        ? availableTables
                            .filter((table) =>
                              formData.tables.includes(table._id) &&
                              table.area === area
                            )
                            .map((table) => `${table.table_number}|${table.area}`)
                        : []
                    }
                    onChange={(value) => handleTableChange(area, value)}
                    placeholder={`Chọn bàn ở ${area}`}
                    className="w-full"
                    popupClassName="border-gray-300 rounded-lg"
                  >
                    {groupedTables[area].map((table) => (
                      <Option
                        key={table._id}
                        value={`${table.table_number}|${table.area}`}
                      >
                        Bàn {table.table_number} (Sức chứa: {table.capacity})
                      </Option>
                    ))}
                  </Select>
                </TabPane>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderBasicInfo;