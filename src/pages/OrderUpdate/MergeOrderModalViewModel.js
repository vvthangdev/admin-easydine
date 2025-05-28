import { useState, useEffect } from "react";
import { tableAPI } from "../../services/apis/Table";
import { orderAPI } from "../../services/apis/Order";
import { toast } from "react-toastify";

const MergeOrderModalViewModel = ({ visible, targetOrder, onCancel, onSuccess }) => {
  const [sourceOrderId, setSourceOrderId] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log("MergeOrderModalViewModel initialized", { visible, targetOrder });
    if (!visible) return;

    const fetchTableStatus = async () => {
      setLoading(true);
      try {
        const tableStatus = await tableAPI.getAllTablesStatus();
        const reservedTables = tableStatus.filter(
          (table) =>
            (table.status === "Occupied" || table.status === "Reserved") &&
            table.reservation_id
        );
        const ordersByReservation = reservedTables.reduce((acc, table) => {
          const reservationId = table.reservation_id;
          if (!acc[reservationId]) {
            acc[reservationId] = {
              id: reservationId,
              tables: [],
              time: table.start_time,
            };
          }
          acc[reservationId].tables.push({
            table_number: table.table_number,
            area: table.area,
          });
          return acc;
        }, {});
        const orders = Object.values(ordersByReservation).filter(
          (order) => order.id !== targetOrder?.id && order.tables.length > 0
        );
        console.log("Available orders detailed:", orders);
        setAvailableOrders(orders);
      } catch (error) {
        toast.error("Không thể tải danh sách đơn hàng: " + (error.message || "Lỗi không xác định."));
      } finally {
        setLoading(false);
      }
    };

    fetchTableStatus();
  }, [visible, targetOrder?.id]);

  const handleSelectOrder = (orderId) => {
    setSourceOrderId(orderId);
  };

  const handleMergeOrder = async () => {
    if (!sourceOrderId) {
      toast.error("Vui lòng chọn đơn hàng muốn gộp!");
      return;
    }
    if (!targetOrder?.id) {
      toast.error("Đơn hàng hiện tại chưa được lưu. Vui lòng lưu đơn hàng trước!");
      return;
    }

    setLoading(true);
    try {
      await orderAPI.mergeOrder({
        source_order_id: sourceOrderId,
        target_order_id: targetOrder.id,
      });
      toast.success(`Gộp đơn thành công! Đơn hàng đích: ${targetOrder.id}`);
      onSuccess();
      onCancel();
    } catch (error) {
      toast.error(`Gộp đơn thất bại: ${error.message || "Lỗi không xác định."}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    sourceOrderId,
    availableOrders,
    loading,
    onSelectOrder: handleSelectOrder,
    onMergeOrder: handleMergeOrder,
  };
};

export default MergeOrderModalViewModel;