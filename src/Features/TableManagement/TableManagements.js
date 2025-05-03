import React, { useEffect, useState } from "react";
import { Button, message, Modal } from "antd";
import { tableAPI } from "../../services/apis/Table";
import TableCard from "./TableCardView/TableCard";
import TableFormModal from "./TableFormModal";
import ReleaseTableModal from "./ReleaseTableModal";
import TableAdmin from "./TableAdmin";
import "./TableManagement.css";

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isReleaseModalVisible, setIsReleaseModalVisible] = useState(false);
  const [isTableListModalVisible, setIsTableListModalVisible] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [releasingTable, setReleasingTable] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const response = await tableAPI.getAllTablesStatus();
      const formattedTables = response.tables.map((table) => {
        const sameOrderTables = response.tables
          .filter(
            (t) =>
              t.reservation_id === table.reservation_id &&
              t.table_number !== table.table_number &&
              t.reservation_id !== null
          )
          .map((t) => t.table_number);
        const orderNumber = table.reservation_id
          ? table.reservation_id.slice(-4)
          : null;
        return {
          ...table,
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
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleAdd = () => {
    setEditingTable(null);
    setIsFormModalVisible(true);
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    setIsFormModalVisible(true);
  };

  const handleDelete = async (table) => {
    try {
      await tableAPI.deleteTable({ table_number: table.table_number });
      setTables(tables.filter((t) => t.table_number !== table.table_number));
      message.success(`Xóa bàn số ${table.table_number} thành công`);
    } catch (error) {
      console.error("Error deleting table:", error);
      message.error("Xóa bàn không thành công");
    }
  };

  const handleReleaseTable = async () => {
    if (!releasingTable?.reservation_id || !releasingTable?.table_number) {
      message.error("Thông tin đặt chỗ hoặc bàn không hợp lệ");
      return;
    }

    try {
      await tableAPI.releaseTable({
        reservation_id: releasingTable.reservation_id,
        table_id: releasingTable.table_number,
      });
      setTables(
        tables.map((table) =>
          table.table_number === releasingTable.table_number
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
          { ...newTable, status: "Available", same_order_tables: null, order_number: null },
        ]);
        message.success(`Thêm bàn số ${requestData.table_number} thành công`);
      }
      setIsFormModalVisible(false);
    } catch (error) {
      console.error("Error saving table:", error);
      message.error(
        editingTable ? "Cập nhật bàn không thành công" : "Thêm bàn không thành công"
      );
    }
  };

  // Callback khi ghép đơn thành công
  const handleMergeSuccess = () => {
    fetchTables(); // Làm mới danh sách bàn
  };

  // Tóm tắt đơn hàng
  const orderSummary = () => {
    const orders = {};
    tables.forEach((table) => {
      if (table.reservation_id) {
        if (!orders[table.reservation_id]) {
          orders[table.reservation_id] = {
            order_number: table.order_number,
            tables: [],
          };
        }
        orders[table.reservation_id].tables.push(table.table_number);
      }
    });

    return Object.values(orders).map((order) => (
      <div key={order.order_number} className="order-summary-item">
        Đơn #{order.order_number}: Bàn {order.tables.sort((a, b) => a - b).join(", ")}
      </div>
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý bàn</h1>
        <div className="flex gap-4">
          <Button
            type="primary"
            onClick={() => setIsTableListModalVisible(true)}
            className="px-4 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Quản lý danh sách bàn
          </Button>
          <Button
            type="primary"
            onClick={handleAdd}
            className="px-4 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Thêm bàn mới
          </Button>
        </div>
      </div>

      {/* Tóm tắt đơn hàng */}
      {tables.some((table) => table.reservation_id) && (
        <div className="order-summary mb-4">
          <h3 className="text-lg font-medium">Tóm tắt đơn hàng</h3>
          {orderSummary()}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 table-container">
        {loading ? (
          <div className="text-center">Đang tải...</div>
        ) : (
          <div className="table-grid">
            {tables.map((table) => (
              <TableCard
                key={table.table_number}
                table={table}
                tables={tables}
                onRelease={() =>
                  setReleasingTable(table) || setIsReleaseModalVisible(true)
                }
                onMergeSuccess={handleMergeSuccess}
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
      >
        <TableAdmin
          tables={tables}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Modal>

      <TableFormModal
        visible={isFormModalVisible}
        onCancel={() => setIsFormModalVisible(false)}
        onSubmit={handleFormSubmit}
        editingTable={editingTable}
      />

      <ReleaseTableModal
        visible={isReleaseModalVisible}
        onCancel={() => setIsReleaseModalVisible(false) || setReleasingTable(null)}
        onConfirm={handleReleaseTable}
        tableNumber={releasingTable?.table_number}
      />
    </div>
  );
}