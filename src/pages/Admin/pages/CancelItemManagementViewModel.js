
import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { canceledItemOrderAPI } from "../../../services/apis/CanceledItemOrderAPI";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
export default function CancelItemManagementViewModel() {
  const [canceledItems, setCanceledItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    item_id: "",
    quantity: 1,
    order_id: "",
    size: "",
    note: "",
    cancel_reason: "",
    canceled_by: "",
    canceled_at: dayjs(),
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Lấy danh sách bản ghi hủy
  const fetchCanceledItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await canceledItemOrderAPI.getAllCanceledItemOrders();
      setCanceledItems(response || []);
      console.log("Danh sách bản ghi hủy:", response);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách bản ghi hủy");
    } finally {
      setLoading(false);
    }
  }, []);

  // Xử lý sửa bản ghi
  const handleEdit = useCallback((record) => {
    setEditingItem(record);
    setFormData({
      item_id: record.item_id?._id || "",
      quantity: record.quantity || 1,
      order_id: record.order_id?._id || "",
      size: record.size || "",
      note: record.note || "",
      cancel_reason: record.cancel_reason || "",
      canceled_by: record.canceled_by?._id || "",
      canceled_at: dayjs(record.canceled_at),
    });
    setIsModalVisible(true);
  }, []);

  // Xử lý xóa bản ghi
  const handleDelete = useCallback(async (id) => {
    try {
      await canceledItemOrderAPI.deleteCanceledItemOrder(id);
      setCanceledItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Xóa bản ghi hủy thành công");
    } catch (error) {
      toast.error("Lỗi khi xóa bản ghi hủy");
    }
  }, []);

  // Xử lý khi submit form
  const handleSubmit = useCallback(async () => {
    try {
      const payload = {
        ...formData,
        canceled_at: formData.canceled_at.toISOString(),
      };

      if (editingItem) {
        await canceledItemOrderAPI.updateCanceledItemOrder(editingItem._id, payload);
        setCanceledItems((prevItems) =>
          prevItems.map((item) => (item._id === editingItem._id ? { ...item, ...payload } : item))
        );
        toast.success("Cập nhật bản ghi hủy thành công");
      }
      setIsModalVisible(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  }, [editingItem, formData]);

  // Lọc và sắp xếp dữ liệu
  const filteredItems = useMemo(() => {
    let result = canceledItems.filter((item) => {
      const matchesSearch =
        item.item_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cancel_reason?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Sắp xếp theo filterStatus
    if (filterStatus === "recent") {
      result.sort((a, b) => new Date(b.canceled_at) - new Date(a.canceled_at));
    } else if (filterStatus === "old") {
      result.sort((a, b) => new Date(a.canceled_at) - new Date(b.canceled_at));
    }

    return result;
  }, [canceledItems, searchTerm, filterStatus]);

  const paginatedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredItems.length / pageSize);

  // Lấy danh sách duy nhất cho Select
  const uniqueItems = Array.from(
    new Map(canceledItems.map((item) => [item.item_id?._id, item.item_id])).values()
  ).filter(Boolean);
  const uniqueOrders = Array.from(
    new Map(canceledItems.map((item) => [item.order_id?._id, item.order_id])).values()
  ).filter(Boolean);
  const uniqueUsers = Array.from(
    new Map(canceledItems.map((item) => [item.canceled_by?._id, item.canceled_by])).values()
  ).filter(Boolean);

  useEffect(() => {
    fetchCanceledItems();
  }, [fetchCanceledItems]);

  const handleExportToExcel = () => {
  // Chuẩn bị dữ liệu cho Excel
  const exportData = canceledItems.map((item) => ({
    "Tên Món": item.item_id?.name || "N/A",
    "Giá": item.item_id?.price?.toLocaleString() || "0",
    "Số Lượng": item.quantity || 1,
    "Mã Đơn Hàng": item.order_id?._id?.slice(-8) || "N/A",
    "Kích Thước": item.size || "Không có",
    "Lý Do Hủy": item.cancel_reason || "",
    "Người Hủy": item.canceled_by?.name || "N/A",
    "Thời Gian Hủy": dayjs(item.canceled_at).format("DD/MM/YYYY HH:mm"),
  }));

  // Tạo worksheet và workbook
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Danh Sách Hủy");

  // Đặt tiêu đề cột
  worksheet["!cols"] = [
    { wch: 20 }, // Tên Món
    { wch: 15 }, // Giá
    { wch: 10 }, // Số Lượng
    { wch: 15 }, // Mã Đơn Hàng
    { wch: 15 }, // Kích Thước
    { wch: 30 }, // Lý Do Hủy
    { wch: 20 }, // Người Hủy
    { wch: 20 }, // Thời Gian Hủy
  ];

  // Xuất file Excel
  XLSX.writeFile(workbook, `DanhSachHuyMonHang_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`);
};

  return {
    canceledItems,
    loading,
    isModalVisible,
    setIsModalVisible,
    editingItem,
    formData,
    setFormData,
    page,
    setPage,
    pageSize,
    searchTerm,
    setSearchTerm: (newValue) => setSearchTerm(newValue.value || ""),
    filterStatus,
    setFilterStatus,
    paginatedItems,
    totalPages,
    uniqueItems,
    uniqueOrders,
    uniqueUsers,
    fetchCanceledItems,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleExportToExcel
  };
}