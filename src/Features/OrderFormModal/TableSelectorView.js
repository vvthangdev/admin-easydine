import React from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  CircularProgress,
  Pagination,
} from "@mui/material";
import TableSelectorViewModel from "./TableSelectorViewModel";

const TableSelectorView = ({ formData, onFormDataChange }) => {
  const {
    groupedTables,
    paginatedTables,
    loading,
    currentTab,
    setCurrentTab,
    handleTableChange,
    page,
    setPage,
    totalPages,
  } = TableSelectorViewModel({ formData, onFormDataChange });

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Chọn bàn
      </Typography>
      {loading ? (
        <Box sx={{ textAlign: "center", py: 4, flex: 1 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Đang tải danh sách bàn...
          </Typography>
        </Box>
      ) : Object.keys(groupedTables).length > 0 ? (
        <>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{ mb: 1 }}
          >
            {Object.keys(groupedTables).map((area) => (
              <Tab
                key={area}
                label={`${area} (${groupedTables[area].length} bàn)`}
                value={area}
              />
            ))}
          </Tabs>
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {Object.keys(groupedTables).map((area) => (
              <Box
                key={area}
                sx={{ display: currentTab === area ? "block" : "none" }}
              >
                <FormControl fullWidth>
                  <InputLabel>Chọn bàn ở {area}</InputLabel>
                  <Select
                    multiple
                    value={
                      formData.tables && groupedTables[area]
                        ? groupedTables[area]
                            .filter((table) => formData.tables.includes(table._id))
                            .map(
                              (table) =>
                                `${table.table_number}|${table.area}|${table._id}`
                            )
                        : []
                    }
                    label={`Chọn bàn ở ${area}`}
                    onChange={(e) => handleTableChange(area, e.target.value)}
                    renderValue={(selected) =>
                      selected.map((key) => key.split("|")[0]).join(", ")
                    }
                  >
                    {paginatedTables
                      .sort((a, b) => {
                        const aSelected = formData.tables.includes(a._id);
                        const bSelected = formData.tables.includes(b._id);
                        return bSelected - aSelected;
                      })
                      .map((table) => (
                        <MenuItem
                          key={table._id}
                          value={`${table.table_number}|${table.area}|${table._id}`}
                          sx={{
                            fontWeight: formData.tables.includes(table._id)
                              ? "bold"
                              : "normal",
                            color: formData.tables.includes(table._id)
                              ? "primary.main"
                              : "inherit",
                          }}
                        >
                          Bàn {table.table_number} (Sức chứa: {table.capacity})
                          {formData.tables.includes(table._id) && " - Đã chọn"}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            ))}
          </Box>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            sx={{ mt: 1, alignSelf: "center" }}
          />
        </>
      ) : (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
          Không có bàn nào
        </Typography>
      )}
    </Box>
  );
};

export default TableSelectorView;