import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { userAPI } from "../../services/apis/User";

const OrderBasicInfo = ({
  formData,
  setFormData,
  availableTables,
  fetchAvailableTables,
  isTableAvailable,
  editingOrder,
}) => {
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [activeTab, setActiveTab] = useState("Tầng 1");

  useEffect(() => {
    const fetchStaffList = async () => {
      setLoadingStaff(true);
      try {
        const users = await userAPI.getAllUser();
        const staffArray = Array.isArray(users) ? users : [];
        setStaffList(staffArray);
        // Kiểm tra xem formData.staff_id có trong staffList không
        if (formData.staff_id && !staffArray.find((staff) => staff._id === formData.staff_id)) {
          setFormData((prev) => ({ ...prev, staff_id: "" }));
        }
      } catch (error) {
        console.error("Error fetching staff list:", error);
        toast.error("Không thể tải danh sách nhân viên");
        setStaffList([]);
      } finally {
        setLoadingStaff(false);
      }
    };
    fetchStaffList();
  }, []); // Xóa formData.staff_id khỏi dependencies để tránh vòng lặp

  const groupedTables = availableTables.reduce((acc, table) => {
    const area = table.area || "Không xác định";
    if (!acc[area]) {
      acc[area] = [];
    }
    acc[area].push(table);
    return acc;
  }, {});

  const handleChange = (field, value) => {
    console.log("handleChange called:", { field, value });
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
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

      console.log("New formData:", newData);
      return newData;
    });
  };

  const handleTableChange = (area, value) => {
    const selectedTableIds = value.map((tableKey) => {
      const [tableNumber, tableArea] = tableKey.split("|");
      const table = availableTables.find(
        (t) => t.table_number === parseInt(tableNumber) && t.area === tableArea
      );
      return table ? table._id : null;
    }).filter((id) => id !== null);

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
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">Thông tin cơ bản</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Loại Đơn Hàng *</InputLabel>
          <Select
            value={formData.type ?? "reservation"}
            label="Loại Đơn Hàng *"
            onChange={(e) => handleChange("type", e.target.value)}
          >
            <MenuItem value="reservation">Đặt Chỗ</MenuItem>
            <MenuItem value="ship">Giao Hàng</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Trạng Thái *</InputLabel>
          <Select
            value={formData.status ?? "pending"}
            label="Trạng Thái *"
            onChange={(e) => {
              console.log("Select status changed:", e.target.value);
              handleChange("status", e.target.value);
            }}
            disabled={isTableAvailable && !editingOrder}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="canceled">Canceled</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Nhân Viên Phụ Trách</InputLabel>
          <Select
            value={staffList.find((staff) => staff._id === formData.staff_id) ? formData.staff_id : ""}
            label="Nhân Viên Phụ Trách"
            onChange={(e) => {
              console.log("Select staff changed:", e.target.value);
              handleChange("staff_id", e.target.value);
            }}
            disabled={loadingStaff}
          >
            <MenuItem value="">Chọn nhân viên</MenuItem>
            {staffList.map((staff) => (
              <MenuItem key={staff._id} value={staff._id}>
                {staff.username || staff.name || "Không xác định"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Ngày *"
          value={formData.date ?? ""}
          onChange={(e) => handleChange("date", e.target.value)}
          placeholder="DD/MM/YYYY"
          fullWidth
        />
        <TextField
          label="Thời Gian Bắt Đầu *"
          value={formData.start_time ?? ""}
          onChange={(e) => handleChange("start_time", e.target.value)}
          placeholder="HH:mm"
          fullWidth
        />
        {formData.type === "reservation" && (
          <Box sx={{ gridColumn: { sm: "span 2" } }}>
            <Typography variant="subtitle1">Chọn Bàn</Typography>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ mb: 1 }}
            >
              {Object.keys(groupedTables).map((area) => (
                <Tab key={area} label={area} value={area} />
              ))}
            </Tabs>
            {Object.keys(groupedTables).map((area) => (
              <Box key={area} sx={{ display: activeTab === area ? "block" : "none" }}>
                <FormControl fullWidth>
                  <InputLabel>Chọn bàn ở {area}</InputLabel>
                  <Select
                    multiple
                    value={
                      formData.tables
                        ? availableTables
                            .filter(
                              (table) =>
                                formData.tables.includes(table._id) && table.area === area
                            )
                            .map((table) => `${table.table_number}|${table.area}`)
                        : []
                    }
                    label={`Chọn bàn ở ${area}`}
                    onChange={(e) => handleTableChange(area, e.target.value)}
                  >
                    {groupedTables[area].map((table) => (
                      <MenuItem
                        key={table._id}
                        value={`${table.table_number}|${table.area}`}
                      >
                        Bàn {table.table_number} (Sức chứa: {table.capacity})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default OrderBasicInfo;