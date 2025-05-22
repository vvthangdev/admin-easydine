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

    return Object.values(orders);
  };

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
    handleDelete,
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