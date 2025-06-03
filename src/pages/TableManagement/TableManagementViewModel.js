import { useEffect, useState, useCallback } from "react";
import { tableAPI } from "../../services/apis/Table";
import { orderAPI } from "../../services/apis/Order";
import { toast } from "react-toastify";

const TableManagementViewModel = () => {
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

  // Fetch tables and their status
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
          area: tablesResponse.find((t) => t._id === table.table_id)?.area || "Unknown",
        };
      });

      console.log("Updated tables:", formattedTables); // Debug log
      setTables(formattedTables);
    } catch (error) {
      console.error("Error fetching tables:", error);
      toast.error("Lỗi khi tải danh sách bàn");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch areas
  const fetchAreas = useCallback(async () => {
    try {
      const response = await tableAPI.getAllAreas();
      if (!Array.isArray(response)) {
        throw new Error("Dữ liệu khu vực không hợp lệ");
      }
      setAreas(response);
      if (response.length > 0 && !activeArea) {
        setActiveArea(response[0]);
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
      toast.error("Lỗi khi tải danh sách khu vực");
    }
  }, [activeArea]);

  // Initial data fetch
  useEffect(() => {
    fetchTables();
    fetchAreas();
  }, [fetchTables, fetchAreas]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    fetchTables();
    fetchAreas();
  }, [fetchTables, fetchAreas]);

  // Handle add table
  const handleAdd = useCallback(() => {
    setEditingTable(null);
    setIsFormModalVisible(true);
  }, []);

  // Handle edit table
  const handleEdit = useCallback((table) => {
    console.log("Setting editingTable:", table); // Debug log
    setEditingTable({
      table_id: table.table_id || table._id,
      table_number: table.table_number,
      capacity: table.capacity,
      area: table.area,
    });
    setIsFormModalVisible(true);
  }, []);

  // Handle delete success
  const handleDeleteSuccess = useCallback(
    (tableId) => {
      console.log("Removing table with ID:", tableId); // Debug log
      setTables(tables.filter((t) => t.table_id !== tableId));
    },
    [tables]
  );

  // Handle release table
  const handleReleaseTable = useCallback(
    async () => {
      if (!releasingTable?.reservation_id || !releasingTable?.table_id) {
        toast.error("Thông tin đặt chỗ hoặc bàn không hợp lệ");
        return;
      }

      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    },
    [releasingTable, tables]
  );

  // Handle form submit for add/edit table
  const handleFormSubmit = useCallback(
    (tableData) => {
      console.log("Received table data for update:", tableData);
      if (!tableData || !tableData.table_id || !tableData.table_number || !tableData.capacity || !tableData.area) {
        console.error("Invalid table data received:", tableData);
        return;
      }

      setLoading(true);
      if (editingTable) {
        setTables(
          tables.map((table) =>
            table.table_id === editingTable.table_id
              ? { ...table, ...tableData }
              : table
          )
        );
      } else {
        setTables([
          ...tables,
          {
            ...tableData,
            status: "Available",
            same_order_tables: null,
            order_number: null,
          },
        ]);
      }
      setIsFormModalVisible(false);
      if (!areas.includes(tableData.area)) {
        fetchAreas();
      }
      setLoading(false);
    },
    [editingTable, tables, areas, fetchAreas]
  );

  // Handle merge success
  const handleMergeSuccess = useCallback(() => {
    fetchTables();
  }, [fetchTables]);

  // Handle order success
  const handleOrderSuccess = useCallback(() => {
    fetchTables();
  }, [fetchTables]);

  // Handle new order
  const handleNewOrder = useCallback(() => {
    setIsOrderModalVisible(true);
  }, []);

  // Handle order submit
  const handleOrderSubmit = useCallback(
  async (orderData) => {
    setLoading(true);
    try {
      // Đảm bảo type là "takeaway" nếu không có bàn
      const finalOrderData = {
        ...orderData,
        type: orderData.tables && orderData.tables.length > 0 ? "reservation" : "takeaway",
      };
      await orderAPI.createOrder(finalOrderData);
      toast.success("Thêm đơn hàng mới thành công");
      fetchTables();
      setIsOrderModalVisible(false);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Thêm đơn hàng không thành công");
    } finally {
      setLoading(false);
    }
  },
  [fetchTables]
);

  // Order summary
  const orderSummary = useCallback(() => {
  const orders = {};
  tables.forEach((table) => {
    if (table.reservation_id) {
      if (!orders[table.reservation_id]) {
        orders[table.reservation_id] = {
          order_number: table.order_number,
          tables: [],
          full_id: table.reservation_id,
          type: "reservation",
        };
      }
      orders[table.reservation_id].tables.push(table.table_number);
    }
  });
  // Lấy các đơn hàng takeaway từ orderAPI
  const fetchTakeawayOrders = async () => {
    try {
      const response = await orderAPI.getAllOrders();
      const takeawayOrders = response.filter((order) => order.type === "takeaway");
      takeawayOrders.forEach((order) => {
        orders[order._id] = {
          order_number: order._id.slice(-4),
          tables: [],
          full_id: order._id,
          type: "takeaway",
        };
      });
    } catch (error) {
      console.error("Error fetching takeaway orders:", error);
    }
  };
  fetchTakeawayOrders();
  return Object.values(orders);
}, [tables]);

  // Filter tables by active area
  const filteredTables = activeArea
    ? tables.filter((table) => table.area === activeArea)
    : tables;

  // Get unique areas for tabs
  const tabAreas = [...new Set(tables.map((table) => table.area))];

  return {
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
  };
};

export default TableManagementViewModel;