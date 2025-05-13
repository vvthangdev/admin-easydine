import React, { useEffect, useState, useCallback } from "react";
import { Modal, message, Button } from "antd";
import moment from "moment";
import OrderBasicInfo from "./OrderBasicInfo";
import ItemSelector from "./ItemSelector";
import SelectedItems from "./SelectedItems";
import { tableAPI } from "../../services/apis/Table";
import { orderAPI } from "../../services/apis/Order";

const OrderFormModal = ({
  visible,
  editingOrder,
  selectedCustomer,
  onCancel,
  onSubmit,
  table,
}) => {
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({
    type: "reservation",
    status: "pending",
    date: moment().format("DD/MM/YYYY"),
    start_time: moment().format("HH:mm"),
    end_time: "23:59", // Mặc định là 23:59
    tables: table ? [table.table_id] : [],
  });
  const [loading, setLoading] = useState(false);
  const [showItemSelector, setShowItemSelector] = useState(false);

  const fetchAvailableTables = useCallback(async (date, startTime, endTime) => {
    if (!date || !startTime || !endTime) return;
    setLoading(true);
    try {
      const response = await tableAPI.getAvailableTables({
        start_time: startTime,
        end_time: endTime,
      });
      setAvailableTables(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching available tables:", error);
      message.error("Không thể tải danh sách bàn trống");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderDetails = useCallback(async () => {
  if (!editingOrder) return;
  setLoading(true);
  try {
    const data = await orderAPI.getOrderInfo({ id: editingOrder.id });

    const reservedTables =
      data.reservedTables?.map((table) => ({
        _id: table.table_id,
        table_number: table.table_number,
        area: table.area,
        capacity: table.capacity,
        status: table.status,
      })) || [];

    const items =
      data.itemOrders?.map((item) => ({
        id: item.item_id,
        name: item.itemName,
        price: item.itemPrice,
        quantity: item.quantity,
        size: item.size || null,
        note: item.note || "",
      })) || [];

    const newFormData = {
      type: data.order?.type || "reservation",
      status: data.order?.status || "pending",
      staff_id: data.order?.staff_id || undefined,
      date: moment
        .utc(data.order?.time || editingOrder.time)
        .local()
        .format("DD/MM/YYYY"),
      start_time: data.reservedTables?.[0]
        ? moment
            .utc(data.reservedTables[0].start_time)
            .local()
            .format("HH:mm")
        : moment
            .utc(data.order?.time || editingOrder.time)
            .local()
            .format("HH:mm"),
      end_time: "23:59", // Mặc định là 23:59
      tables: reservedTables.map((table) => table._id),
    };

    setFormData(newFormData);
    setSelectedItems(items);

    // Lấy danh sách bàn trống
    const startDateTime = moment(
      `${newFormData.date} ${newFormData.start_time}`,
      "DD/MM/YYYY HH:mm"
    ).utc();
    const endDateTime = moment(
      `${newFormData.date} 23:59`,
      "DD/MM/YYYY HH:mm"
    ).utc();
    
    // Gọi API lấy bàn trống
    const response = await tableAPI.getAvailableTables({
      start_time: startDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
      end_time: endDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
    });

    // Kết hợp danh sách bàn trống với các bàn đã đặt của đơn hàng
    const availableTablesFromAPI = Array.isArray(response) ? response : [];
    const existingTableIds = availableTablesFromAPI.map((table) => table._id);
    const additionalReservedTables = reservedTables.filter(
      (table) => !existingTableIds.includes(table._id)
    );
    const mergedTables = [...availableTablesFromAPI, ...additionalReservedTables];

    setAvailableTables(mergedTables);
  } catch (error) {
    console.error("Error loading order for edit:", error);
    message.error("Không thể tải thông tin đơn hàng");
  } finally {
    setLoading(false);
  }
}, [editingOrder]);

  const resetForm = useCallback(() => {
    const now = moment();
    const newFormData = {
      date: now.format("DD/MM/YYYY"),
      start_time: now.format("HH:mm"),
      end_time: "23:59", // Mặc định là 23:59
      type: "reservation",
      status: "pending",
      tables: table ? [table.table_id] : [],
    };
    setFormData(newFormData);
    setSelectedItems([]);
    setAvailableTables([]);
    setMenuItems([]);
    setShowItemSelector(false);

    const startDateTime = moment(
      `${newFormData.date} ${newFormData.start_time}`,
      "DD/MM/YYYY HH:mm"
    ).utc();
    const endDateTime = moment(
      `${newFormData.date} 23:59`,
      "DD/MM/YYYY HH:mm"
    ).utc();
    fetchAvailableTables(
      newFormData.date,
      startDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
      endDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]")
    );
  }, [table, fetchAvailableTables]);

  useEffect(() => {
    if (visible) {
      if (editingOrder) {
        fetchOrderDetails();
      } else {
        resetForm();
      }
    }
  }, [visible, editingOrder, fetchOrderDetails, resetForm]);

  const handleModalOk = async () => {
    const isValidDate = moment(formData.date, "DD/MM/YYYY", true).isValid();
    const isValidStartTime = moment(formData.start_time, "HH:mm", true).isValid();
    const isValidEndTime = moment(formData.end_time, "HH:mm", true).isValid();

    if (
      !formData.type ||
      !formData.date ||
      !formData.start_time ||
      !formData.end_time
    ) {
      message.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }
    if (!isValidDate || !isValidStartTime || !isValidEndTime) {
      message.error("Định dạng ngày hoặc giờ không hợp lệ");
      return;
    }
    if (
      formData.type === "reservation" &&
      (!formData.tables || formData.tables.length === 0)
    ) {
      message.error("Vui lòng chọn ít nhất một bàn");
      return;
    }
    if (!selectedItems || selectedItems.length === 0) {
      message.error("Vui lòng chọn ít nhất một món ăn");
      return;
    }

    setLoading(true);
    try {
      const startDateTime = moment(
        `${formData.date} ${formData.start_time}`,
        "DD/MM/YYYY HH:mm"
      ).utc();
      const endDateTime = moment(
        `${formData.date} ${formData.end_time}`,
        "DD/MM/YYYY HH:mm"
      ).utc();

      const orderData = {
        id: editingOrder ? editingOrder.id : undefined,
        start_time: startDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        end_time: endDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        type: formData.type,
        status: formData.status,
        tables: formData.tables || [],
        items: selectedItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          size: item.size || null,
          note: item.note || "",
        })),
        customer_id: selectedCustomer?._id,
        staff_id: formData.staff_id || null,
      };

      await onSubmit(orderData);
      setFormData({});
      setSelectedItems([]);
      setAvailableTables([]);
      setMenuItems([]);
      setShowItemSelector(false);
      onCancel();
    } catch (error) {
      console.error("Error submitting order:", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItemClick = () => {
    setShowItemSelector(true);
  };

  const handleDoneSelectingItems = () => {
    setShowItemSelector(false);
  };

  return (
    <Modal
      title={editingOrder ? "Sửa Đơn Hàng" : "Thêm Đơn Hàng Mới"}
      open={visible}
      onCancel={onCancel}
      width="90vw"
      className="rounded-xl"
      styles={{ padding: 0, background: "transparent" }}
      footer={[
        <Button
          key="cancel"
          className="px-6 py-2 text-base font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md"
          onClick={onCancel}
          disabled={loading}
        >
          Hủy
        </Button>,
        <Button
          key="submit"
          className="px-6 py-2 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
          onClick={handleModalOk}
          loading={loading}
        >
          {editingOrder ? "Cập nhật" : "Thêm"}
        </Button>,
      ]}
    >
      <div className="flex h-[80vh] bg-white/80 backdrop-blur-md rounded-xl overflow-hidden">
        <div className="w-1/2 p-4 border-r border-gray-200 overflow-y-auto">
          {showItemSelector ? (
            <ItemSelector
              setSelectedItems={setSelectedItems}
              menuItems={menuItems}
              setMenuItems={setMenuItems}
            />
          ) : (
            <OrderBasicInfo
              formData={formData}
              setFormData={setFormData}
              availableTables={availableTables}
              fetchAvailableTables={fetchAvailableTables}
            />
          )}
        </div>
        <div className="w-1/2 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              {showItemSelector ? (
                <Button
                  className="px-6 py-2 text-base font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md"
                  onClick={handleDoneSelectingItems}
                  disabled={loading}
                >
                  Xong
                </Button>
              ) : (
                <Button
                  className="px-6 py-2 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
                  onClick={handleAddItemClick}
                  disabled={loading}
                >
                  Thêm Món
                </Button>
              )}
            </div>
          </div>
          <SelectedItems
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            menuItems={menuItems}
          />
        </div>
      </div>
    </Modal>
  );
};

export default OrderFormModal;