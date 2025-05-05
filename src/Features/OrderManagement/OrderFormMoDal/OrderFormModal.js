import React, { useEffect, useState, useCallback } from "react";
import { Modal, message, Button } from "antd";
import moment from "moment";
import OrderBasicInfo from "./OrderBasicInfo";
import ItemSelector from "./ItemSelector";
import SelectedItems from "./SelectedItems";
import { tableAPI } from "../../../services/apis/Table";
import { orderAPI } from "../../../services/apis/Order";

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
    end_time: moment().add(1, "hours").format("HH:mm"),
    tables: table ? [table.table_number] : [],
  });
  const [loading, setLoading] = useState(false);
  const [showItemSelector, setShowItemSelector] = useState(false); // Trạng thái hiển thị ItemSelector

  const fetchAvailableTables = useCallback(async (date, startTime, endTime) => {
    if (!date || !startTime || !endTime) return;
    setLoading(true);
    try {
      const response = await tableAPI.getAvailableTables({
        start_time: startTime,
        end_time: endTime,
      });
      setAvailableTables(response);
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
      const response = await orderAPI.getOrderInfo({ id: editingOrder.id });
      const data = response;

      const reservedTables =
        data.reservedTables?.map((table) => table.table_id) || [];
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
        type: editingOrder.type || "reservation",
        status: editingOrder.status || "pending",
        staff_id: data.order?.staff_id || undefined,
        date: moment
          .utc(data.time || editingOrder.time)
          .local()
          .format("DD/MM/YYYY"),
        start_time: data.reservedTables?.[0]
          ? moment
              .utc(data.reservedTables[0].start_time)
              .local()
              .format("HH:mm")
          : moment
              .utc(data.time || editingOrder.time)
              .local()
              .format("HH:mm"),
        end_time: data.reservedTables?.[0]
          ? moment.utc(data.reservedTables[0].end_time).local().format("HH:mm")
          : moment
              .utc(data.time || editingOrder.time)
              .local()
              .add(1, "hours")
              .format("HH:mm"),
        tables: reservedTables,
      };

      setFormData(newFormData);
      setSelectedItems(items);

      const startDateTime = moment(
        `${newFormData.date} ${newFormData.start_time}`,
        "DD/MM/YYYY HH:mm"
      ).utc();
      const endDateTime = moment(
        `${newFormData.date} ${newFormData.end_time}`,
        "DD/MM/YYYY HH:mm"
      ).utc();
      fetchAvailableTables(
        newFormData.date,
        startDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        endDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]")
      );
    } catch (error) {
      console.error("Error loading order for edit:", error);
      message.error("Không thể tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [editingOrder, fetchAvailableTables]);

  const resetForm = useCallback(() => {
    const now = moment();
    const newFormData = {
      date: now.format("DD/MM/YYYY"),
      start_time: now.format("HH:mm"),
      end_time: now.add(1, "hours").format("HH:mm"),
      type: "reservation",
      status: "pending",
      tables: table ? [table.table_number] : [],
    };
    setFormData(newFormData);
    setSelectedItems([]);
    setAvailableTables([]);
    setMenuItems([]);
    setShowItemSelector(false); // Đặt lại trạng thái hiển thị

    const startDateTime = moment(
      `${newFormData.date} ${newFormData.start_time}`,
      "DD/MM/YYYY HH:mm"
    ).utc();
    const endDateTime = moment(
      `${newFormData.date} ${newFormData.end_time}`,
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
    const isValidStartTime = moment(
      formData.start_time,
      "HH:mm",
      true
    ).isValid();
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
        tables: formData.tables || [], // Sửa lỗi: thay 'tablesintre' thành 'tables'
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
      setShowItemSelector(false); // Đặt lại trạng thái hiển thị
      onCancel();
    } catch (error) {
      console.error("Error submitting order:", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItemClick = () => {
    setShowItemSelector(true); // Chuyển sang hiển thị ItemSelector
  };

  const handleDoneSelectingItems = () => {
    setShowItemSelector(false); // Quay lại hiển thị OrderBasicInfo
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
        {/* Phần bên trái: OrderBasicInfo hoặc ItemSelector */}
        <div className="w-1/2 p-4 border-r border-gray-200 overflow-y-auto">
          {showItemSelector ? (
            <ItemSelector
              setSelectedItems={setSelectedItems}
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
        {/* Phần bên phải: SelectedItems với nút Thêm Món/Xong ở trên bên trái */}
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
