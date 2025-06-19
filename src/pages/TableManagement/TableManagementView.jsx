import React from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Dialog,
} from "@mui/material";
import { toast } from "react-toastify";
import TableCardView from "../TableManagement/TableCardView/TableCardView";
import TableFormModalView from "../TableManagement/TableFormModalView";
import ReleaseTableModalView from "../TableManagement/ReleaseTableModalView";
import TableAdminView from "../TableManagement/TableAdminView";
import OrderFormModalView from "../OrderFormModal/OrderFormModalView";
import TableManagementViewModel from "./TableManagementViewModel";
import RefreshIcon from "@mui/icons-material/Refresh";

const TableManagementView = () => {
  const {
    tables,
    areas,
    isFormModalVisible,
    isReleaseModalVisible,
    isTableListModalVisible,
    isOrderModalVisible,
    editingTable,
    releasingTable,
    loading,
    activeArea,
    tabAreas,
    filteredTables,
    setIsFormModalVisible,
    setIsReleaseModalVisible,
    setIsTableListModalVisible,
    setIsOrderModalVisible,
    setActiveArea,
    setReleasingTable,
    handleRefresh,
    handleAdd,
    handleEdit,
    handleDeleteSuccess,
    handleReleaseTable,
    handleFormSubmit,
    handleMergeSuccess,
    handleOrderSuccess,
    handleNewOrder,
    handleOrderSubmit,
    orderSummary,
  } = TableManagementViewModel();

  return (
    <Box sx={{ p: 3, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsTableListModalVisible(true)}
            disabled={loading}
          >
            Quản lý danh sách bàn
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleNewOrder}
            disabled={loading}
          >
            Đặt đơn hàng mới
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress />
        </Box>
      ) : tabAreas.length > 0 ? (
        <Tabs
          value={activeArea}
          onChange={(e, newValue) => setActiveArea(newValue)}
          sx={{ mb: 3 }}
        >
          {tabAreas.map((area) => (
            <Tab label={area} value={area} key={area} />
          ))}
        </Tabs>
      ) : (
        <Typography textAlign="center">Không có khu vực nào</Typography>
      )}

      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: 1,
          p: 2,
        }}
      >
        {loading ? (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : filteredTables.length === 0 ? (
          <Typography textAlign="center">Không có bàn nào</Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(auto-fill, minmax(200px, 1fr))",
                sm: "repeat(auto-fill, minmax(250px, 1fr))",
              },
              gap: 2,
            }}
          >
            {filteredTables.map((table) => (
              <TableCardView
                key={table.table_id}
                table={table}
                tables={tables}
                onRelease={() => {
                  setReleasingTable(table);
                  setIsReleaseModalVisible(true);
                }}
                onMergeSuccess={handleMergeSuccess}
                onOrderSuccess={handleOrderSuccess}
              />
            ))}
          </Box>
        )}
      </Box>

      <Dialog
        open={isTableListModalVisible}
        onClose={() => setIsTableListModalVisible(false)}
        maxWidth="md"
        fullWidth
        sx={{ "& .MuiDialog-paper": { borderRadius: 2, top: 10 } }}
      >
        <TableAdminView
          tables={tables}
          areas={areas}
          onAddSuccess={handleAdd}
          onEditSuccess={handleEdit}
          onDeleteSuccess={handleDeleteSuccess}
        />
      </Dialog>

      <TableFormModalView
        open={isFormModalVisible}
        onClose={() => setIsFormModalVisible(false)}
        onSubmitSuccess={handleFormSubmit}
        editingTable={editingTable}
      />

      <ReleaseTableModalView
        open={isReleaseModalVisible}
        onClose={() => {
          setIsReleaseModalVisible(false);
          setReleasingTable(null);
        }}
        onConfirm={handleReleaseTable}
        tableNumber={releasingTable?.table_number}
      />

      <OrderFormModalView
        visible={isOrderModalVisible}
        editingOrder={null}
        selectedCustomer={null}
        onCancel={() => setIsOrderModalVisible(false)}
        onSubmit={handleOrderSubmit}
        table={null}
      />
    </Box>
  );
};

export default TableManagementView;