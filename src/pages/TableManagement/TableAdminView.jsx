import React from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import TableAdminViewModel from "./TableAdminViewModel";

const TableAdminView = ({ tables, areas, onAddSuccess, onEditSuccess, onDeleteSuccess }) => {
  const {
    activeArea,
    setActiveArea,
    filteredTables,
    tabAreas,
    loading,
    handleDelete,
    handleAdd,
    handleEdit,
  } = TableAdminViewModel({
    tables,
    areas,
    onAddSuccess,
    onEditSuccess,
    onDeleteSuccess,
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Danh sách bàn</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          disabled={loading}
        >
          Thêm bàn mới
        </Button>
      </Box>

      {tabAreas.length > 0 && (
        <Tabs
          value={activeArea}
          onChange={(e, newValue) => setActiveArea(newValue)}
          sx={{ mb: 2 }}
        >
          {tabAreas.map((area) => (
            <Tab label={area} value={area} key={area} />
          ))}
        </Tabs>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Số bàn</TableCell>
                <TableCell>Sức chứa</TableCell>
                <TableCell>Khu vực</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTables.map((table) => (
                <TableRow key={table._id || table.table_id}>
                  <TableCell>{table.table_number}</TableCell>
                  <TableCell>{table.capacity}</TableCell>
                  <TableCell>{table.area}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(table)}
                      sx={{ mr: 1 }}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(table.table_id)}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TableAdminView;