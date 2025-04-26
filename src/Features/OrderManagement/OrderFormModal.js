import React, { useEffect, useState, useCallback } from "react";
import { Modal } from "antd";
import { orderAPI } from "../../services/apis/Order";
import OrderBasicInfo from "./OrderBasicInfo";
import ItemSelector from "./ItemSelector";
import SelectedItems from "./SelectedItems";
import moment from "moment";

const OrderFormModal = ({
  visible,
  editingOrder,
  selectedCustomer,
  onCancel,
  onSubmit,
}) => {
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({});

  const fetchOrderDetails = useCallback(async () => {
    if (!editingOrder) return;

    try {
      const orderDetails = await orderAPI.getOrderDetails(editingOrder.id);
      const data = orderDetails.data || orderDetails;

      const reservedTables = data.reservedTables?.map((table) => table.table_id) || [];

      const items = data.itemOrders?.map((item) => ({
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
        date: moment.utc(data.time || editingOrder.time).local().format("DD/MM/YYYY"),
        start_time: data.reservedTables?.[0]
          ? moment.utc(data.reservedTables[0].start_time).local().format("HH:mm")
          : moment.utc(data.time || editingOrder.time).local().format("HH:mm"),
        end_time: data.reservedTables?.[0]
          ? moment.utc(data.reservedTables[0].end_time).local().format("HH:mm")
          : moment.utc(data.time || editingOrder.time).local().add(1, "hours").format("HH:mm"),
        tables: reservedTables,
      };

      setFormData(newFormData);
      setSelectedItems(items);

      const startDateTime = moment(`${newFormData.date} ${newFormData.start_time}`, "DD/MM/YYYY HH:mm").utc();
      const endDateTime = moment(`${newFormData.date} ${newFormData.end_time}`, "DD/MM/YYYY HH:mm").utc();

      fetchAvailableTables(
        newFormData.date,
        startDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        endDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]")
      );
    } catch (error) {
      console.error("Error loading order for edit:", error);
    }
  }, [editingOrder]);

  const resetForm = () => {
    const now = moment(); // Local time
    setFormData({
      date: now.format("DD/MM/YYYY"),
      start_time: now.format("HH:mm"),
      end_time: now.add(1, "hours").format("HH:mm"),
      type: "reservation",
      status: "pending",
    });
    setAvailableTables([]);
    setSelectedItems([]);
  };

  const fetchAvailableTables = async (date, startTime, endTime) => {
    try {
      if (!date || !startTime || !endTime) return;

      const response = await orderAPI.getAvailableTables({
        start_time: startTime,
        end_time: endTime,
      });
      setAvailableTables(response.data || response);
    } catch (error) {
      console.error("Error fetching available tables:", error);
    }
  };

  useEffect(() => {
    if (visible) {
      if (editingOrder) {
        fetchOrderDetails();
      } else {
        resetForm();
      }
    }
  }, [visible, editingOrder, fetchOrderDetails]);

  const handleModalOk = async () => {
    if (
      !formData.type ||
      !formData.date ||
      !formData.start_time ||
      !formData.end_time
    ) {
      return;
    }

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
    };

    onSubmit(orderData);
  };

  return (
    <Modal
      title={editingOrder ? "Sửa Đơn Hàng" : "Thêm Đơn Hàng Mới"}
      open={visible}
      onOk={handleModalOk}
      onCancel={onCancel}
      width="90vw"
      className="rounded-xl"
      bodyStyle={{ padding: 0, background: "transparent" }}
      footer={[
        <button
          key="cancel"
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300"
          onClick={onCancel}
        >
          Hủy
        </button>,
        <button
          key="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
          onClick={handleModalOk}
        >
          {editingOrder ? "Cập nhật" : "Thêm"}
        </button>,
      ]}
    >
      <div className="flex h-[80vh] bg-white/80 backdrop-blur-md rounded-xl">
        <div className="flex-[2] p-6 border-r border-gray-200 overflow-auto">
          <OrderBasicInfo
            formData={formData}
            setFormData={setFormData}
            availableTables={availableTables}
            fetchAvailableTables={fetchAvailableTables}
          />
        </div>
        <div className="flex-[4] p-6 border-r border-gray-200 overflow-auto">
          <ItemSelector setSelectedItems={setSelectedItems} />
        </div>
        <div className="flex-[4] p-6 overflow-auto">
          <SelectedItems
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </div>
      </div>
    </Modal>
  );
};

export default OrderFormModal;