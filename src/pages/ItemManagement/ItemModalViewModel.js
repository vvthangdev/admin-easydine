const ItemModalViewModel = ({ type, editingItem, selectedItem }) => {
  const getTitle = () => {
    if (type === "item") return editingItem ? "Sửa thông tin món ăn" : "Thêm món ăn mới";
    if (type === "category") return "Thêm danh mục mới";
    return `Xác nhận xóa ${type === "deleteItem" ? "món ăn" : "danh mục"}`;
  };

  const getDeleteMessage = () => {
    if (type === "deleteItem" || type === "deleteCategory") {
      return `Bạn có chắc chắn muốn xóa ${
        type === "deleteItem" ? "món ăn" : "danh mục"
      } <strong>${selectedItem?.name}</strong> không? Hành động này không thể hoàn tác.`;
    }
    return "";
  };

  return {
    title: getTitle(),
    deleteMessage: getDeleteMessage(),
  };
};

export default ItemModalViewModel;