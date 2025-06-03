import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { tableAPI } from "../../services/apis/Table";
import { orderAPI } from "../../services/apis/Order";

const OrderFormModalViewModel = ({
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
    status:
      table?.status === "Available" || !editingOrder ? "confirmed" : "pending",
    date: moment().format("DD/MM/YYYY"),
    start_time: moment().format("HH:mm"),
    end_time: "23:59",
    tables: table ? [table.table_id] : [],
    items: [],
    voucherCode: "",
    totalAmount: 0,
    discountAmount: 0,
    finalAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [splitModalVisible, setSplitModalVisible] = useState(false);
  const [mergeModalVisible, setMergeModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const targetOrder = useMemo(
    () => ({ id: currentOrderId || editingOrder?.id }),
    [currentOrderId, editingOrder?.id]
  );

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
      toast.error("Không thể tải danh sách bàn trống");
      setAvailableTables([]);
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
        table_id: table.table_id,
        _id: table.table_id,
        table_number: table.table_number,
        area: table.area,
        capacity: table.capacity,
        status: table.status,
        start_time: table.start_time,
        end_time: table.end_time,
      })) || [];

    const items =
      data.itemOrders?.map((item) => ({
        id: item.item_id,
        name: item.itemName,
        price: item.itemPrice,
        quantity: item.quantity,
        size: item.size || null,
        note: item.note || "",
        itemName: item.itemName,
        itemImage: item.itemImage || "https://via.placeholder.com/80",
      })) || [];

    const newFormData = {
      type: reservedTables.length > 0 ? "reservation" : "takeaway",
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
      end_time: data.reservedTables?.[0]
        ? moment
            .utc(data.reservedTables[0].end_time)
            .local()
            .format("HH:mm")
        : moment
            .utc(data.order?.time || editingOrder.time)
            .local()
            .format("HH:mm"),
      tables: reservedTables.map((table) => table.table_id),
      items,
      reservedTables,
      voucherCode: data.order?.voucher_code || "",
      totalAmount: data.order?.total_amount || 0,
      discountAmount: data.order?.discount_amount || 0,
      finalAmount: data.order?.final_amount || 0,
      number_people: data.order?.number_people || 1,
    };

    setFormData(newFormData);
    setOrderDetails({
      ...data,
      order: {
        ...data.order,
        id: editingOrder.id,
        customer_id: editingOrder.customerId,
        time: editingOrder.time,
      },
    });
    setCurrentOrderId(editingOrder.id);

    const startDateTime = moment(
      `${newFormData.date} ${newFormData.start_time}`,
      "DD/MM/YYYY HH:mm"
    ).utc();
    const endDateTime = moment(
      `${newFormData.date} 23:59`,
      "DD/MM/YYYY HH:mm"
    ).utc();

    const response = await tableAPI.getAvailableTables({
      start_time: startDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
      end_time: endDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
    });

    const availableTablesFromAPI = Array.isArray(response) ? response : [];
    setAvailableTables(availableTablesFromAPI);
  } catch (error) {
    console.error("Error loading order for edit:", error);
    toast.error("Không thể tải thông tin đơn hàng");
    setAvailableTables([]);
    setFormData((prev) => ({ ...prev, items: [], reservedTables: [] }));
  } finally {
    setLoading(false);
  }
}, [editingOrder]);

  const resetForm = useCallback(() => {
    const now = moment();
    const newFormData = {
      date: now.format("DD/MM/YYYY"),
      start_time: now.format("HH:mm"),
      end_time: "23:59",
      type: table ? "reservation" : "takeaway",
      status: "confirmed",
      tables: table ? [table.table_id] : [],
      items: [],
      voucherCode: "",
      totalAmount: 0,
      discountAmount: 0,
      finalAmount: 0,
    };
    setFormData(newFormData);
    setSelectedItems([]);
    setAvailableTables([]);
    setMenuItems([]);
    setShowItemSelector(true);
    setOrderDetails(null);
    setCurrentOrderId(null);

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
  setFormData((prev) => ({
    ...prev,
    type: prev.tables && prev.tables.length > 0 ? "reservation" : "takeaway",
  }));
}, [formData.tables, setFormData]);

  useEffect(() => {
    if (visible) {
      if (editingOrder) {
        fetchOrderDetails();
      } else {
        resetForm();
      }
    }
  }, [visible, editingOrder, fetchOrderDetails, resetForm]);

  const validateFormData = (customItems = null) => {
    const itemsToCheck = customItems || formData.items;

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
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return false;
    }
    if (!isValidDate || !isValidStartTime || !isValidEndTime) {
      toast.error("Định dạng ngày hoặc giờ không hợp lệ");
      return false;
    }
    if (
      formData.type === "reservation" &&
      (!formData.tables || formData.tables.length === 0)
    ) {
      toast.error("Vui lòng chọn ít nhất một bàn");
      return false;
    }
    if (!itemsToCheck || itemsToCheck.length === 0) {
      toast.error("Vui lòng chọn ít nhất một món ăn");
      return false;
    }

    return true;
  };

  const handleModalOk = async (customItems = null) => {
    console.log(
      "handleModalOk called. customItems:",
      customItems,
      "formData.items:",
      formData.items
    );
    const itemsToUse = Array.isArray(customItems)
      ? customItems
      : Array.isArray(formData.items)
      ? formData.items
      : [];

    if (!validateFormData(itemsToUse)) {
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
        items: itemsToUse.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          size: item.size || null,
          note: item.note || "",
        })),
        customer_id: selectedCustomer?._id,
        staff_id: formData.staff_id || null,
        voucherCode: formData.voucherCode || null,
        totalAmount: formData.totalAmount || 0,
        discountAmount: formData.discountAmount || 0,
        finalAmount: formData.finalAmount || 0,
        number_people: formData.number_people || 1,
      };

      const response = await onSubmit(orderData);
      if (!editingOrder && response?._id) {
        setCurrentOrderId(response._id);
        setOrderDetails({
          order: {
            id: response._id,
            customer_id: selectedCustomer?._id,
            time: startDateTime.toISOString(),
            type: formData.type,
            status: formData.status,
            voucher_code: formData.voucherCode,
            total_amount: formData.totalAmount,
            discount_amount: formData.discountAmount,
            final_amount: formData.finalAmount,
          },
          reservedTables: formData.tables.map((tableId) => ({
            table_id: tableId,
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
          })),
          itemOrders: itemsToUse.map((item) => ({
            item_id: item.id,
            itemName: item.name,
            itemPrice: item.price,
            itemImage: item.itemImage,
            quantity: item.quantity,
            size: item.size || null,
            note: item.note || "",
          })),
        });
      }

      onCancel();
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItemClick = () => {
    setSelectedItems([]);
    setShowItemSelector(true);
  };

  const handleDoneSelectingItems = async () => {
    setLoading(true);
    try {
      const processedItems = selectedItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size || null,
        note: item.note || "",
        itemName: item.itemName || item.name,
        itemImage: item.itemImage || "https://via.placeholder.com/80",
      }));

      if (editingOrder) {
        const orderId = currentOrderId || editingOrder.id;
        const itemsToAdd = selectedItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          size: item.size || null,
          note: item.note || "",
        }));
        await orderAPI.addItemsToOrder({
          order_id: orderId,
          items: itemsToAdd,
        });
        toast.success("Thêm món thành công");
        setShowItemSelector(false);
        onCancel();
      } else {
        if (formData.type === "reservation" &&( !formData.tables || formData.tables.length === 0)) {
          toast.error("Vui lòng chọn ít nhất một bàn");
          setLoading(false);
          return;
        }

        setFormData((prev) => ({
          ...prev,
          items: processedItems,
        }));

        await handleModalOk(processedItems);
      }
    } catch (error) {
      console.error("Error processing items:", error);
      toast.error("Lỗi khi xử lý món ăn");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAddItems = () => {
    setSelectedItems([]);
    setShowItemSelector(false);
    onCancel();
  };

  const handleConfirmOrder = async () => {
    setLoading(true);
    try {
      await orderAPI.updateOrderStatus({
        id: currentOrderId || editingOrder.id,
        status: "confirmed",
      });
      setFormData((prev) => ({ ...prev, status: "confirmed" }));
      toast.success("Đơn hàng đã được xác nhận");
    } catch (error) {
      console.error("Error confirming order:", error);
      toast.error("Lỗi khi xác nhận đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setLoading(true);
    try {
      await orderAPI.updateOrderStatus({
        id: currentOrderId || editingOrder.id,
        status: "canceled",
      });
      toast.success("Đơn hàng đã được hủy");
      onCancel();
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error("Lỗi khi hủy đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleSplitSuccess = () => {
    if (editingOrder || currentOrderId) {
      fetchOrderDetails();
      onSubmit({ id: currentOrderId || editingOrder.id });
    }
  };

  const handleMergeSuccess = () => {
    if (editingOrder || currentOrderId) {
      fetchOrderDetails();
      onSubmit({ id: currentOrderId || editingOrder.id });
    }
  };

  const handleOpenSplitModal = async () => {
    if (!currentOrderId && !editingOrder) {
      toast.info("Vui lòng lưu đơn hàng trước khi tách!");
      await handleModalOk();
      if (currentOrderId) {
        setSplitModalVisible(true);
      }
    } else {
      setSplitModalVisible(true);
    }
  };

  const handleOpenMergeModal = async () => {
    if (!currentOrderId && !editingOrder) {
      toast.info("Vui lòng lưu đơn hàng trước khi gộp!");
      await handleModalOk();
      if (currentOrderId) {
        setMergeModalVisible(true);
      }
    } else {
      setMergeModalVisible(true);
    }
  };

  return {
    availableTables,
    selectedItems,
    setSelectedItems,
    menuItems,
    setMenuItems,
    formData,
    setFormData,
    loading,
    showItemSelector,
    splitModalVisible,
    mergeModalVisible,
    orderDetails,
    currentOrderId,
    targetOrder,
    fetchAvailableTables,
    handleModalOk,
    handleAddItemClick,
    handleDoneSelectingItems,
    handleSplitSuccess,
    handleMergeSuccess,
    handleOpenSplitModal,
    handleOpenMergeModal,
    handleConfirmOrder,
    handleCancelOrder,
    handleCancelAddItems,
    setMergeModalVisible,
    setSplitModalVisible,
  };
};

export default OrderFormModalViewModel;