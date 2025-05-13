import React, { useEffect, useState, useCallback } from "react";
import { Button, message, Modal, Tabs } from "antd";
import { tableAPI } from "../../services/apis/Table";
import TableCard from "../TableManagement/TableCardView/TableCard";
import TableFormModal from "./TableFormModal";
import OrderFormModal from "../OrderFormModal/OrderFormModal";
import ReleaseTableModal from "./ReleaseTableModal";
import TableAdmin from "./TableAdmin";
import "./TableManagement.css";
import { orderAPI } from "../../services/apis/Order";
import { ReloadOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

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
      message.error("Lỗi khi tải danh sách bàn");
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
      message.error("Lỗi khi tải danh sách khu vực");
    }
  }, [activeArea]);

  // Hàm xử lý nút làm mới
  const handleRefresh = () => {
    fetchTables();
    fetchAreas();
  };

  useEffect(() => {
    // Chỉ gọi API nếu dữ liệu chưa tồn tại
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
      message.success(`Xóa bàn thành công`);
      // Chỉ gọi fetchAreas nếu cần (ví dụ: khu vực có thể bị ảnh hưởng)
      // fetchAreas();
    } catch (error) {
      console.error("Error deleting table:", error);
      message.error("Xóa bàn không thành công");
    }
  };

  const handleReleaseTable = async () => {
    if (!releasingTable?.reservation_id || !releasingTable?.table_id) {
      message.error("Thông tin đặt chỗ hoặc bàn không hợp lệ");
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
      message.success(`Trả bàn số ${releasingTable.table_number} thành công`);
      setIsReleaseModalVisible(false);
      setReleasingTable(null);
    } catch (error) {
      console.error("Error releasing table:", error);
      message.error("Trả bàn không thành công");
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
        message.success(`Cập nhật bàn số ${requestData.table_number} thành công`);
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
        message.success(`Thêm bàn số ${requestData.table_number} thành công`);
      }
      setIsFormModalVisible(false);
      // Chỉ gọi fetchAreas nếu khu vực mới được thêm
      if (!areas.includes(requestData.area)) {
        fetchAreas();
      }
    } catch (error) {
      console.error("Error saving table:", error);
      message.error(
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
      message.success("Thêm đơn hàng mới thành công");
      fetchTables();
      setIsOrderModalVisible(false);
    } catch (error) {
      console.error("Error creating order:", error);
      message.error("Thêm đơn hàng không thành công");
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
      <div key={order.order_number} className="order-summary-item">
        Đơn #
        <span
          className="text-blue-600 cursor-pointer hover:underline"
          onClick={() => {
            navigator.clipboard.writeText(order.full_id).then(() => {
              message.success(`Đã sao chép mã đơn hàng: ${order.full_id}`);
            }).catch(() => {
              message.error("Không thể sao chép mã đơn hàng");
            });
          }}
        >
          {order.order_number}
        </span>
        : Bàn {order.tables.sort((a, b) => a - b).join(", ")}
      </div>
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          Quản lý bàn
        </h1>
        <div className="flex gap-4">
          <Button
            type="primary"
            onClick={handleRefresh}
            icon={<ReloadOutlined />}
            className="px-4 py-1 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
          >
            Làm mới
          </Button>
          <Button
            type="primary"
            onClick={() => setIsTableListModalVisible(true)}
            className="px-4 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Quản lý danh sách bàn
          </Button>
          <Button
            type="primary"
            onClick={handleNewOrder}
            className="px-4 py-1 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            Đặt đơn hàng mới
          </Button>
        </div>
      </div>

      {tables.some((table) => table.reservation_id) && (
        <div className="order-summary mb-4">
          <h3 className="text-lg font-medium">Tóm tắt đơn hàng</h3>
          {orderSummary()}
        </div>
      )}

      {tabAreas.length > 0 ? (
        <Tabs activeKey={activeArea} onChange={setActiveArea} className="mb-4">
          {tabAreas.map((area) => (
            <TabPane tab={area} key={area} />
          ))}
        </Tabs>
      ) : (
        <div className="text-center">Không có khu vực nào</div>
      )}

      <div className="bg-white rounded-lg shadow p-4 table-container">
        {loading ? (
          <div className="text-center">Đang tải...</div>
        ) : filteredTables.length === 0 ? (
          <div className="text-center">Không có bàn nào</div>
        ) : (
          <div className="table-grid">
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
          </div>
        )}
      </div>

      <Modal
        title="Quản lý danh sách bàn"
        open={isTableListModalVisible}
        onCancel={() => setIsTableListModalVisible(false)}
        footer={null}
        width={800}
        className="rounded-xl"
        style={{ top: 10 }}
        zIndex={25}
      >
        <TableAdmin
          tables={tables}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          areas={areas}
        />
      </Modal>

      <TableFormModal
        visible={isFormModalVisible}
        onCancel={() => setIsFormModalVisible(false)}
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
    </div>
  );
}