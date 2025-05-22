import React from "react";
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
import OrderBasicInfoViewModel from "./OrderBasicInfoViewModel";

const OrderBasicInfoView = ({
  formData,
  setFormData,
  availableTables,
  fetchAvailableTables,
  isTableAvailable,
  editingOrder,
}) => {
  const {
    staffList,
    loadingStaff,
    activeTab,
    setActiveTab,
    groupedTables,
    handleChange,
    handleTableChange,
  } = OrderBasicInfoViewModel({
    formData,
    setFormData,
    availableTables,
    fetchAvailableTables,
    isTableAvailable,
    editingOrder,
  });

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
            onChange={(e) => handleChange("status", e.target.value)}
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
            onChange={(e) => handleChange("staff_id", e.target.value)}
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

export default OrderBasicInfoView;