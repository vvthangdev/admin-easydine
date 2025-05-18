import React, { useState } from "react";
import {
  Box,
  Button,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getVietnameseStatus } from "./TableCardView/TableCardUtils";

const TableAdmin = ({ tables, onEdit, onDelete, onAdd, areas }) => {
  const initialArea = areas.length > 0 ? areas[0] : "";
  const [activeArea, setActiveArea] = useState(initialArea);

  const columns = [
    {
      field: "table_number",
      headerName: "Số bàn",
      width: 150,
      sortable: true,
    },
    {
      field: "capacity",
      headerName: "Sức chứa",
      width: 150,
      sortable: true,
    },
    {
      field: "area",
      headerName: "Khu vực",
      width: 150,
      sortable: true,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params) => (
        <Typography
          sx={{
            color:
              params.value === "Available"
                ? "green"
                : params.value === "Reserved"
                ? "orange"
                : "blue",
          }}
        >
          {getVietnameseStatus(params.value)}
        </Typography>
      ),
    },
    {
      fieldXRD: "action",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => onEdit(params.row)}
          >
            Sửa
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => onDelete(params.row.table_id)}
          >
            Xóa
          </Button>
        </Box>
      ),
    },
  ];

  const filteredTables =
    activeArea === ""
      ? tables
      : tables.filter((table) => table.area === activeArea);

  const tabAreas = [...new Set(tables.map((table) => table.area))];

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onAdd}
        >
          Thêm bàn mới
        </Button>
      </Box>
      {tabAreas.length > 0 ? (
        <Tabs
          value={activeArea}
          onChange={(e, newValue) => setActiveArea(newValue)}
          sx={{ mb: 2 }}
        >
          {tabAreas.map((area) => (
            <Tab label={area} value={area} key={area} />
          ))}
        </Tabs>
      ) : (
        <Typography textAlign="center" sx={{ mb: 2 }}>
          Không có khu vực nào
        </Typography>
      )}
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredTables}
          columns={columns}
          getRowId={(row) => row.table_number}
          pageSizeOptions={[10]}
          pagination
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default TableAdmin;