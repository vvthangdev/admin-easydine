import { useMemo } from "react";

const SelectedItemsViewModel = ({ selectedItems, setSelectedItems }) => {
  const handleRemove = (id, size) => {
    setSelectedItems((prev) =>
      prev.filter((item) => !(item.id === id && item.size === size))
    );
  };

  const handleEditItem = (itemData) => {
    setSelectedItems((prev) => {
      const existing = prev.find(
        (item) => item.id === itemData.id && item.size === itemData.size
      );
      if (existing) {
        return prev.map((item) =>
          item.id === itemData.id && item.size === itemData.size
            ? { ...item, quantity: itemData.quantity, note: itemData.note }
            : item
        );
      }
      return prev.map((item) =>
        item.id === itemData.id && item.size !== itemData.size
          ? item
          : itemData
      );
    });
  };

  const subtotal = useMemo(() => {
    return selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [selectedItems]);

  const vat = useMemo(() => subtotal * 0.1, [subtotal]);

  const total = useMemo(() => subtotal + vat, [subtotal, vat]);

  return {
    handleRemove,
    handleEditItem,
    subtotal,
    vat,
    total,
  };
};

export default SelectedItemsViewModel;