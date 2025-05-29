import TableAvailable from "../../../assets/images/table_available.png";
import TableReserved from "../../../assets/images/table_reserved.png";
import TableOccupied from "../../../assets/images/table_occupied.png";
import { orderAPI } from "../../../services/apis/Order";
import { toast } from "react-toastify";

export const getTableImage = (status) => {
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

export const getVietnameseStatus = (status) => {
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

export const getSourceTables = (tables, currentReservationId) => {
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

export const handleMergeOrder = async (
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