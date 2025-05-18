import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Dialog,
} from "@mui/material";
import { tableAPI } from "../../services/apis/Table";
import TableCard from "../TableManagement/TableCardView/TableCard";
import TableFormModal from "./TableFormModal";
import OrderFormModal from "../OrderFormModal/OrderFormModal";
import ReleaseTableModal from "./ReleaseTableModal";
import TableAdmin from "./TableAdmin";
import { orderAPI } from "../../services/apis/Order";
import { toast } from "react-toastify";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [areas, setAreas] = useState([]);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isReleaseModalVisible, setIsReleaseModalVisible] = useState(false);
  const [isTableListModalVisible, setIsTableListModalVisible] = useState(false);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [releasingTable, setReleasingTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeArea, setActiveArea] = useState("");

  const fetchTables = useCallback(async () => {
    setLoading(true);
    try {
      const statusResponse = await tableAPI.getAllTablesStatus();
      if (!Array.isArray(statusResponse)) {
        throw new Error("Dữ liệu bàn không phải mảng hoặc không hợp lệ");
      }

      const tablesResponse = await tableAPI.getAllTable();
      if (!Array.isArray(tablesResponse)) {
        throw new Error("Dữ liệu bàn không phải mảng hoặc không hợp lệ");
      }

      const idToNumberMap = tablesResponse.reduce((acc, table) => {
        acc[table._id] = table.table_number;
        return acc;
      }, {});

      const formattedTables = statusResponse.map((table) => {
        const tableNumber = idToNumberMap[table.table_id] || "Unknown";
        const sameOrderTables = statusResponse
          .filter(
            (t) =>
              t.reservation_id === table.reservation_id &&
              t.table_id !== table.table_id &&
              t.reservation_id !== null
          )
          .map((t) => idToNumberMap[t.table_id] || "Unknown");
        const orderNumber = table.reservation_id
          ? table.reservation_id.slice(-4)
          : null;
        return {
          ...table,
          table_number: tableNumber,
          same_order_tables: sameOrderTables.length ? sameOrderTables : null,
          order_number: orderNumber,
        };
      });

      setTables(formattedTables);
    } catch (error) {
      console.error("Error fetching tables:", error);
      toast.error("Lỗi khi tải danh sách bàn");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAreas = useCallback(async () => {
    try {
      const response = await tableAPI.getAllAreas();
      setAreas(response);
      if (response.length > 0 && !response.includes(activeArea)) {
        setActiveArea(response[0]);
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
      toast.error("Lỗi khi tải danh sách khu vực");
    }
  }, [activeArea]);

  const handleRefresh = () => {
    fetchTables();
    fetchAreas();
  };

  useEffect(() => {
    if (tables.length === 0) {
      fetchTables();
    }
    if (areas.length === 0) {
      fetchAreas();
    }
  }, [fetchTables, fetchAreas, tables.length, areas.length]);

  const tabAreas = [...new Set(tables.map((table) => table.area))];

  const filteredTables =
    activeArea === ""
      ? tables
      : tables.filter((table) => table.area === activeArea);

  const handleAdd = () => {
    setEditingTable(null);
    setIsFormModalVisible(true);
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    setIsFormModalVisible(true);
  };

  const handleDelete = async (tableId) => {
    try {
      await tableAPI.deleteTable({ table_id: tableId });
      setTables(tables.filter((t) => t.table_id !== tableId));
      toast.success(`Xóa bàn thành công`);
    } catch (error) {
      console.error("Error deleting table:", error);
      toast.error("Xóa bàn không thành công");
    }
  };

  const handleReleaseTable = async () => {
    if (!releasingTable?.reservation_id || !releasingTable?.table_id) {
      toast.error("Thông tin đặt chỗ hoặc bàn không hợp lệ");
      return;
    }

    try {
      await tableAPI.releaseTable({
        reservation_id: releasingTable.reservation_id,
        table_id: releasingTable.table_id,
      });
      setTables(
        tables.map((table) =>
          table.table_id === releasingTable.table_id
            ? {
                ...table,
                status: "Available",
                start_time: null,
                end_time: null,
                reservation_id: null,
                same_order_tables: null,
                order_number: null,
              }
            : table
        )
      );
      toast.success(`Trả bàn số ${releasingTable.table_number} thành công`);
      setIsReleaseModalVisible(false);
      setReleasingTable(null);
    } catch (error) {
      console.error("Error releasing table:", error);
      toast.error("Trả bàn không thành công");
    }
  };

  const handleFormSubmit = async (values) => {
    const requestData = {
      table_number: values.table_number,
      capacity: values.capacity,
      area: Array.isArray(values.area) ? values.area[0] : values.area,
    };

    try {
      if (editingTable) {
        await tableAPI.updateTable(requestData);
        setTables(
          tables.map((table) =>
            table.table_number === editingTable.table_number
              ? { ...table, ...requestData }
              : table
          )
        );
        toast.success(`Cập nhật bàn số ${requestData.table_number} thành công`);
      } else {
        const newTable = await tableAPI.addTable(requestData);
        setTables([
          ...tables,
          {
            ...newTable,
            status: "Available",
            area: requestData.area,
            same_order_tables: null,
            order_number: null,
          },
        ]);
        toast.success(`Thêm bàn số ${requestData.table_number} thành công`);
      }
      setIsFormModalVisible(false);
      if (!areas.includes(requestData.area)) {
        fetchAreas();
      }
    } catch (error) {
      console.error("Error saving table:", error);
      toast.error(
        editingTable ? "Cập nhật bàn không thành công" : "Thêm bàn không thành công"
      );
    }
  };

  const handleMergeSuccess = () => {
    fetchTables();
  };

  const handleOrderSuccess = () => {
    fetchTables();
  };

  const handleNewOrder = () => {
    setIsOrderModalVisible(true);
  };

  const handleOrderSubmit = async (orderData) => {
    try {
      await orderAPI.createOrder(orderData);
      toast.success("Thêm đơn hàng mới thành công");
      fetchTables();
      setIsOrderModalVisible(false);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Thêm đơn hàng không thành công");
    }
  };

  const orderSummary = () => {
    const orders = {};
    tables.forEach((table) => {
      if (table.reservation_id) {
        if (!orders[table.reservation_id]) {
          orders[table.reservation_id] = {
            order_number: table.order_number,
            tables: [],
            full_id: table.reservation_id,
          };
        }
        orders[table.reservation_id].tables.push(table.table_number);
      }
    });

    return Object.values(orders).map((order) => (
      <Box key={order.order_number} sx={{ mb: 1 }}>
        <Typography variant="body2">
          Đơn #
          <span
            style={{ color: "#1976d2", cursor: "pointer", textDecoration: "underline" }}
            onClick={() => {
              navigator.clipboard.writeText(order.full_id).then(() => {
                toast.success(`Đã sao chép mã đơn hàng: ${order.full_id}`);
              }).catch(() => {
                toast.error("Không thể sao chép mã đơn hàng");
              });
            }}
          >
            {order.order_number}
          </span>
          : Bàn {order.tables.sort((a, b) => a - b).join(", ")}
        </Typography>
      </Box>
    ));
  };

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
        <Typography
          variant="h5"
          sx={{
            bgcolor: "#1976d2",
            color: "#fff",
            p: 1,
            borderRadius: 2,
            "&:hover": { bgcolor: "#1565c0" },
          }}
        >
          Quản lý bàn
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsTableListModalVisible(true)}
          >
            Quản lý danh sách bàn
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleNewOrder}
          >
            Đặt đơn hàng mới
          </Button>
        </Box>
      </Box>

      {tables.some((table) => table.reservation_id) && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tóm tắt đơn hàng
          </Typography>
          {orderSummary()}
        </Box>
      )}

      {tabAreas.length > 0 ? (
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
              <TableCard
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
        <TableAdmin
          tables={tables}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          areas={areas}
        />
      </Dialog>

      <TableFormModal
        open={isFormModalVisible}
        onClose={() => setIsFormModalVisible(false)}
        onSubmit={handleFormSubmit}
        editingTable={editingTable}
        areas={areas}
      />

      <ReleaseTableModal
        visible={isReleaseModalVisible}
        onCancel={() => {
          setIsReleaseModalVisible(false);
          setReleasingTable(null);
        }}
        onConfirm={handleReleaseTable}
        tableNumber={releasingTable?.table_number}
      />

      <OrderFormModal
        visible={isOrderModalVisible}
        editingOrder={null}
        selectedCustomer={null}
        onCancel={() => setIsOrderModalVisible(false)}
        onSubmit={handleOrderSubmit}
        table={null}
      />
    </Box>
  );
}