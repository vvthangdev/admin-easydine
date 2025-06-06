import { useEffect, useState } from "react";
import { message } from "antd";
import { itemAPI } from "../../services/apis/Item";
import minioClient from "../../Server/minioClient";

export const ItemManagementViewModel = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isDeleteConfirmModalVisible, setIsDeleteConfirmModalVisible] = useState(false);
  const [isDeleteCategoryModalVisible, setIsDeleteCategoryModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  
  // Thêm state cho form data
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    categories: [],
    sizes: []
  });

  const fetchMenuItems = async (categoryId = null) => {
    setLoading(true);
    try {
      let response = categoryId
        ? await itemAPI.filterItemsByCategory(categoryId)
        : await itemAPI.getAllItem();
      setMenuItems(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      message.error("Lỗi khi tải danh sách món ăn");
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await itemAPI.getAllCategories();
      setCategories(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      message.error("Lỗi khi tải danh sách danh mục");
      setCategories([]);
    }
  };

  const handleSearchByName = async (name) => {
    setLoading(true);
    try {
      if (!name) {
        fetchMenuItems(filterCategory);
      } else {
        const response = await itemAPI.searchItem({ name });
        setMenuItems(Array.isArray(response) ? response : []);
      }
    } catch (error) {
      message.error("Lỗi khi tìm kiếm món ăn");
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: "",
      price: 0,
      description: "",
      categories: [],
      sizes: []
    });
  };

  const handleAdd = () => {
    setEditingItem(null);
    resetFormData(); // Reset form data khi thêm mới
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    setFileList(
      record.image
        ? [{ uid: "-1", name: record.image, status: "done", url: record.image }]
        : []
    );
    // Điền toàn bộ thông tin món ăn vào formData
    setFormData({
      name: record.name || "",
      price: record.price || 0,
      description: record.description || "",
      categories: record.categories?.map((cat) => cat._id) || [],
      sizes: record.sizes || [],
    });
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    setSelectedItem(record);
    setIsDeleteConfirmModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await itemAPI.deleteItem({ id: selectedItem._id });
      message.success("Xóa món ăn thành công");
      setMenuItems(menuItems.filter((item) => item._id !== selectedItem._id));
    } catch (error) {
      message.error("Xóa món ăn không thành công");
    } finally {
      setIsDeleteConfirmModalVisible(false);
      setSelectedItem(null);
    }
  };

  const handleModalOk = async (formValues) => {
    try {
      let imageUrl = editingItem?.image || "";
      if (fileList?.length > 0 && fileList?.[0].originFileObj) {
        const file = fileList[0].originFileObj;
        const fileName = `images/${Date.now()}_${file.name}`;
        const { error } = await minioClient.storage
          .from("test01")
          .upload(fileName, file);
        if (error) throw new Error("Không thể upload file");
        const { data } = minioClient.storage
          .from("test01")
          .getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      const requestData = { ...formValues, image: imageUrl };
      if (editingItem) {
        const response = await itemAPI.updateItem({
          ...requestData,
          id: editingItem._id,
        });
        setMenuItems(
          menuItems.map((item) =>
            item._id === editingItem._id ? response.Item : item
          )
        );
        message.success("Cập nhật món ăn thành công");
        await fetchMenuItems(filterCategory);
      } else {
        const newItem = await itemAPI.addItem(requestData);
        setMenuItems([...menuItems, newItem]);
        message.success("Thêm món ăn mới thành công");
      }
      setIsModalVisible(false);
      setFileList([]);
      setEditingItem(null);
      resetFormData(); // Reset form sau khi hoàn thành
    } catch (error) {
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleAddCategory = () => {
    resetFormData(); // Reset form data cho category
    setIsCategoryModalVisible(true);
  };

  const handleCategoryModalOk = async (formValues) => {
    try {
      const newCategory = await itemAPI.createCategory(formValues);
      setCategories([...categories, newCategory]);
      message.success("Tạo danh mục thành công");
      setIsCategoryModalVisible(false);
      resetFormData(); // Reset form sau khi hoàn thành
    } catch (error) {
      message.error("Tạo danh mục không thành công");
    }
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setIsDeleteCategoryModalVisible(true);
  };

  const handleConfirmDeleteCategory = async () => {
    try {
      await itemAPI.deleteCategory(selectedCategory._id);
      message.success("Xóa danh mục thành công");
      setCategories(
        categories.filter((cat) => cat._id !== selectedCategory._id)
      );
      fetchMenuItems(filterCategory);
    } catch (error) {
      message.error("Xóa danh mục không thành công");
    } finally {
      setIsDeleteCategoryModalVisible(false);
      setSelectedCategory(null);
    }
  };

  const handleFilterByCategory = (categoryId) => {
    setFilterCategory(categoryId);
    fetchMenuItems(categoryId === "all" ? null : categoryId);
  };

  // Handle modal cancel
  const handleModalCancel = () => {
    setIsModalVisible(false);
    resetFormData();
    setFileList([]);
    setEditingItem(null);
  };

  const handleCategoryModalCancel = () => {
    setIsCategoryModalVisible(false);
    resetFormData();
  };

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  return {
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
    formData, // Thêm formData vào return
    setFormData, // Thêm setFormData vào return
    setIsModalVisible,
    setIsCategoryModalVisible,
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
  };
};