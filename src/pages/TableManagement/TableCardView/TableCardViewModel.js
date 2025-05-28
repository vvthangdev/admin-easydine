import { useState } from "react";
import moment from "moment";
import { orderAPI } from "../../../services/apis/Order";
import { toast } from "react-toastify";
import TableAvailable from "../../../assets/images/table_available.png";
import TableReserved from "../../../assets/images/table_reserved.png";
import TableOccupied from "../../../assets/images/table_occupied.png";

const getTableImage = (status) => {
  switch (status) {
    case "Available":
      return TableAvailable;
    case "Reserved":
      return TableReserved;
    case "Occupied":
      return TableOccupied;
    default:
      return TableAvailable;
  }
};

const getVietnameseStatus = (status) => {
  switch (status) {
    case "Available":
      return "Trống";
    case "Reserved":
      return "Đã đặt";
    case "Occupied":
      return "Đang sử dụng";
    default:
      return status;
  }
};

const getSourceTables = (tables, currentReservationId) => {
  if (!currentReservationId) return [];
  const seenReservations = new Set();
  return tables
    .filter((t) => {
      if (
        t.reservation_id &&
        t.reservation_id !== currentReservationId &&
        t.status !== "Available"
      ) {
        if (!seenReservations.has(t.reservation_id)) {
          seenReservations.add(t.reservation_id);
          return true;
        }
        return false;
      }
      return false;
    })
    .sort((a, b) => a.table_number - b.table_number);
};

const handleMergeOrder = async (
  sourceTable,
  tables,
  table,
  onMergeSuccess,
  setIsMergeModalVisible
) => {
  try {
    const sourceTableNumber = Math.min(
      ...tables
        .filter((t) => t.reservation_id === sourceTable.reservation_id)
        .map((t) => t.table_number)
    );
    const targetTableNumber = Math.min(
      ...tables
        .filter((t) => t.reservation_id === table.reservation_id)
        .map((t) => t.table_number)
    );

    const data = {
      source_table_number: sourceTableNumber,
      target_table_number: targetTableNumber,
    };

    await orderAPI.mergeOrder(data);

    toast.success(
      `Ghép đơn từ bàn ${sourceTableNumber} vào bàn ${targetTableNumber} thành công`
    );
    setIsMergeModalVisible(false);
    onMergeSuccess();
  } catch (error) {
    console.error("Error merging order:", error);
    toast.error("Ghép đơn không thành công");
  }
};

const TableCardViewModel = ({ table, onRelease, tables, onMergeSuccess, onOrderSuccess }) => {
  const [isMergeModalVisible, setIsMergeModalVisible] = useState(false);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const calculateServingTime = (startTime, status) => {
    if (!startTime || status === "Available") return "-";
    const start = moment.utc(startTime).local();
    const now = moment();
    const duration = moment.duration(now.diff(start));
    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.asMinutes()) % 60;
    const prefix = status === "Reserved" ? "Đã đặt" : "Đã phục vụ";
    if (hours > 0) {
      return `${prefix}: ${hours} giờ ${minutes} phút`;
    }
    return `${prefix}: ${minutes} phút`;
  };

  const handleCardClick = async () => {
    if (table.status === "Available") {
      setIsOrderModalVisible(true);
      setEditingOrder(null);
    } else {
      try {
        const response = await orderAPI.getOrderInfo({
          table_id: table.table_id,
        });
        if (response) {
          setEditingOrder({
            id: response.order.id,
            type: response.order.type,
            status: response.order.status,
            time: response.order.time,
            customer_id: response.order.customer_id || response.customer_id,
            reservedTables: response.reservedTables,
            itemOrders: response.itemOrders,
          });
          setIsOrderModalVisible(true);
        } else {
          toast.error("Không tìm thấy thông tin đơn hàng");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Không thể tải thông tin đơn hàng");
      }
    }
  };

  const handleOrderSubmit = async (orderData) => {
    try {
      if (orderData.id) {
        await orderAPI.updateOrder(orderData);
        toast.success("Cập nhật đơn hàng thành công");
      } else {
        await orderAPI.createOrder(orderData);
        toast.success("Thêm đơn hàng mới thành công");
      }
      setIsOrderModalVisible(false);
      setEditingOrder(null);
      onOrderSuccess();
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Không thể lưu đơn hàng");
    }
  };

  return {
    isMergeModalVisible,
    setIsMergeModalVisible,
    isOrderModalVisible,
    setIsOrderModalVisible,
    editingOrder,
    calculateServingTime,
    getTableImage,
    getVietnameseStatus,
    getSourceTables,
    handleCardClick,
    handleOrderSubmit,
    handleMergeOrder,
    setEditingOrder
  };
};

export default TableCardViewModel;