import TableAvailable from "../../../assets/images/table_available.png";
import TableReserved from "../../../assets/images/table_reserved.png";
import TableOccupied from "../../../assets/images/table_occupied.png";
import { orderAPI } from "../../../services/apis/Order";
import { message } from "antd";

// Hàm chọn hình ảnh dựa trên trạng thái
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

// Lấy danh sách bàn nguồn (chỉ lấy bàn đại diện cho mỗi đơn hàng)
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
          return true; // Chỉ lấy bàn có table_number nhỏ nhất trong nhóm
        }
        return false;
      }
      return false;
    })
    .sort((a, b) => a.table_number - b.table_number);
};

// Xử lý ghép đơn
export const handleMergeOrder = async (
  sourceTable,
  tables,
  table,
  onMergeSuccess,
  setIsMergeModalVisible,
  setIsModalVisible
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

    message.success(
      `Ghép đơn từ bàn ${sourceTableNumber} vào bàn ${targetTableNumber} thành công`
    );
    setIsMergeModalVisible(false);
    setIsModalVisible(false);
    onMergeSuccess();
  } catch (error) {
    console.error("Error merging order:", error);
    message.error("Ghép đơn không thành công");
  }
};