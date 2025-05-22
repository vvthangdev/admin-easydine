import { useMemo } from "react";

const SelectedItemsViewModel = ({ selectedItems, setSelectedItems, menuItems }) => {
  const handleQuantityChange = (id, size, value) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: parseInt(value) || 1 }
          : item
      )
    );
  };

  const handleSizeChange = (id, oldSize, newSize) => {
    setSelectedItems((prev) => {
      const item = prev.find((i) => i.id === id && i.size === oldSize);
      if (!item) return prev;
      const menuItem = menuItems.find((m) => m._id === id);
      const sizeInfo = newSize
        ? menuItem?.sizes.find((s) => s.name === newSize)
        : null;
      return prev.map((i) =>
        i.id === id && i.size === oldSize
          ? {
              ...i,
              size: newSize || null,
              price: sizeInfo ? sizeInfo.price : menuItem?.price || i.price,
            }
          : i
      );
    });
  };

  const handleNoteChange = (id, size, value) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size ? { ...item, note: value } : item
      )
    );
  };

  const handleRemove = (id, size) => {
    setSelectedItems((prev) =>
      prev.filter((item) => !(item.id === id && item.size === size))
    );
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
    handleQuantityChange,
    handleSizeChange,
    handleNoteChange,
    handleRemove,
    subtotal,
    vat,
    total,
  };
};

export default SelectedItemsViewModel;