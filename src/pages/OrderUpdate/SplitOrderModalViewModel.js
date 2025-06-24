import { useState, useEffect } from "react";
import { message } from "antd";
import { orderAPI } from "../../services/apis/Order";

const SplitOrderModalViewModel = ({ orderDetails, onCancel, onSuccess }) => {
  const [splitItems, setSplitItems] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (orderDetails?.itemOrders) {
      const initialItems = orderDetails.itemOrders.map((item, index) => ({
        key: `${item.item_id || item._id}-${item.size || "default"}-${index}`,
        item_id: item.item_id || item._id,
        itemName: item.itemName || "N/A",
        itemImage: item.itemImage || "https://via.placeholder.com/80",
        itemPrice: item.itemPrice || 0,
        size: item.size || "Mặc định",
        note: item.note || "",
        quantity: item.quantity || 0,
        splitQuantity: 0,
        maxQuantity: item.quantity || 0,
        selected: false,
      }));
      setSplitItems(initialItems);
    } else {
      setSplitItems([]);
    }
  }, [orderDetails]);

  const updateSplitQuantity = (key, value) => {
    const quantity = parseInt(value) || 0;
    setSplitItems((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
              ...item,
              splitQuantity: Math.min(quantity, item.maxQuantity),
              selected: quantity > 0 ? true : item.selected,
            }
          : item
      )
    );
    updateSelectedCount();
  };

  const selectAllItems = (newSelectAll) => {
    setSelectAll(newSelectAll);
    setSplitItems((prev) =>
      prev.map((item) => ({
        ...item,
        selected: newSelectAll,
        splitQuantity: newSelectAll ? item.maxQuantity : 0,
      }))
    );
    updateSelectedCount();
  };

  const toggleItemSelection = (key) => {
    setSplitItems((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
              ...item,
              selected: !item.selected,
              splitQuantity: !item.selected ? item.maxQuantity : 0,
            }
          : item
      )
    );
    updateSelectedCount();
  };

  const updateSelectedCount = () => {
    setSplitItems((prev) => {
      const count = prev.filter((item) => item.selected && item.splitQuantity > 0).length;
      setSelectedCount(count);
      return prev;
    });
  };

  const handleSplitOrder = async () => {
    if (!orderDetails?.order?.id) {
      message.error("Không tìm thấy ID đơn hàng để tách!");
      return;
    }
    if (splitItems.every((item) => item.splitQuantity === 0)) {
      message.error("Vui lòng chọn ít nhất một món để tách!");
      return;
    }

    const newItems = splitItems
      .filter((item) => item.splitQuantity > 0)
      .map((item) => ({
        id: item.item_id,
        quantity: item.splitQuantity,
        size: item.size !== "Mặc định" ? item.size : undefined,
        note: item.note || undefined,
      }));

    try {
      const data = await orderAPI.splitOrder({
        order_id: orderDetails.order.id,
        new_items: newItems,
      });
      if (data?.newOrder?.id) {
        message.success(`Tách đơn thành công! Mã đơn mới: ${data.newOrder.id}`);
      } else {
        message.success("Tách đơn thành công!");
      }
      onSuccess();
      onCancel();
    } catch (error) {
      message.error(`Tách đơn thất bại: ${error.message || "Lỗi không xác định."}`);
    }
  };

  const totalSelectedAmount = splitItems
    .filter((item) => item.selected && item.splitQuantity > 0)
    .reduce((sum, item) => sum + item.itemPrice * item.splitQuantity, 0);

  return {
    splitItems,
    selectedCount,
    selectAll,
    totalSelectedAmount,
    handleSplitOrder,
    updateSplitQuantity,
    selectAllItems,
    toggleItemSelection,
  };
};

export default SplitOrderModalViewModel;