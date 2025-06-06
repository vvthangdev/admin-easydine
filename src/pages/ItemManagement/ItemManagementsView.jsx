import { Box } from "@mui/material"
import SearchFilterBar from "./SearchFilterBar"
import ItemTable from "./ItemTable"
import ItemModal from "./ItemModalView"
import { ItemManagementViewModel } from "./ItemManagementsViewModel"

export default function ItemManagement() {

  const {
    menuItems,
    categories,
    isModalVisible,
    isCategoryModalVisible,
    isDeleteConfirmModalVisible,
    isDeleteCategoryModalVisible,
    editingItem,
    loading,
    fileList,
    selectedItem,
    selectedCategory,
    formData, // Thêm formData
    setFormData, // Thêm setFormData
    setIsDeleteConfirmModalVisible,
    setIsDeleteCategoryModalVisible,
    setFileList,
    handleSearchByName,
    handleAdd,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleModalOk,
    handleAddCategory,
    handleCategoryModalOk,
    handleDeleteCategory,
    handleConfirmDeleteCategory,
    handleFilterByCategory,
    handleModalCancel, // Thêm handler cancel
    handleCategoryModalCancel, // Thêm handler cancel cho category
  } = ItemManagementViewModel()

  return (
    <Box
      sx={{
        p: 4,
        background: "linear-gradient(145deg, #f5f5f7 0%, #ffffff 100%)",
        minHeight: "100vh",
        position: "relative",
        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at top left, rgba(0, 122, 255, 0.05), transparent 70%)",
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <SearchFilterBar
          categories={categories}
          onSearch={handleSearchByName}
          onFilter={handleFilterByCategory}
          onAddItem={handleAdd}
          onAddCategory={handleAddCategory}
        />

        <Box
          sx={{
            mt: 3,
            borderRadius: 4,
            background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
          }}
        >
          <ItemTable
            menuItems={menuItems}
            categories={categories}
            loading={loading}
            onEdit={handleEdit} // Bỏ form parameter
            onDelete={handleDelete}
            onDeleteCategory={handleDeleteCategory}
          />
        </Box>

        {/* Modal cho thêm/sửa món ăn */}
        <ItemModal
          type="item"
          visible={isModalVisible}
          editingItem={editingItem}
          categories={categories}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          formData={formData} // Thay form bằng formData
          setFormData={setFormData} // Thêm setFormData
          fileList={fileList}
          setFileList={setFileList}
        />

        {/* Modal cho thêm danh mục */}
        <ItemModal
          type="category"
          visible={isCategoryModalVisible}
          onOk={handleCategoryModalOk}
          onCancel={handleCategoryModalCancel}
          formData={formData} // Thay form bằng formData
          setFormData={setFormData} // Thêm setFormData
        />

        {/* Modal xác nhận xóa món ăn */}
        <ItemModal
          type="deleteItem"
          visible={isDeleteConfirmModalVisible}
          selectedItem={selectedItem}
          onOk={handleConfirmDelete}
          onCancel={() => setIsDeleteConfirmModalVisible(false)}
        />

        {/* Modal xác nhận xóa danh mục */}
        <ItemModal
          type="deleteCategory"
          visible={isDeleteCategoryModalVisible}
          selectedItem={selectedCategory}
          onOk={handleConfirmDeleteCategory}
          onCancel={() => setIsDeleteCategoryModalVisible(false)}
        />
      </Box>
    </Box>
  )
}