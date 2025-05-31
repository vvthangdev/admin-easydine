import React, { useEffect, useState } from "react";
import { Form, message } from "antd";
import { itemAPI } from "../../services/apis/Item";
import minioClient from "../../Server/minioClient";
import SearchFilterBar from "./SearchFilterBar";
import ItemTable from "./ItemTable";
import ItemModal from "./ItemModal";

export default function ItemManagements() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isDeleteConfirmModalVisible, setIsDeleteConfirmModalVisible] =
    useState(false);
  const [isDeleteCategoryModalVisible, setIsDeleteCategoryModalVisible] =
    useState(false);
  const [form] = Form.useForm();
  const [categoryForm] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);

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
        // Fix: Set menuItems directly to response (array of items)
        setMenuItems(Array.isArray(response) ? response : []);
      }
    } catch (error) {
      message.error("Lỗi khi tìm kiếm món ăn");
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      categories: record.categories?.map((cat) => cat._id),
      description: record.description || "",
      sizes: record.sizes || [],
    });
    setFileList([
      { uid: "-1", name: record.image, status: "done", url: record.image },
    ]);
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

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
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

      const requestData = { ...values, image: imageUrl };
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
      } else {
        const newItem = await itemAPI.addItem(requestData);
        setMenuItems([...menuItems, newItem]);
        message.success("Thêm món ăn mới thành công");
      }
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleAddCategory = () => {
    categoryForm.resetFields();
    setIsCategoryModalVisible(true);
  };

  const handleCategoryModalOk = async () => {
    try {
      const values = await categoryForm.validateFields();
      const newCategory = await itemAPI.createCategory(values);
      setCategories([...categories, newCategory]);
      message.success("Tạo danh mục thành công");
      setIsCategoryModalVisible(false);
      categoryForm.resetFields();
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

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col">
      <SearchFilterBar
        categories={categories}
        onSearch={handleSearchByName}
        onFilter={handleFilterByCategory}
        onAddItem={handleAdd}
        onAddCategory={handleAddCategory}
      />
      <ItemTable
        menuItems={menuItems}
        categories={categories}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeleteCategory={handleDeleteCategory}
      />
      <ItemModal
        type="item"
        visible={isModalVisible}
        editingItem={editingItem}
        categories={categories}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setFileList([]);
        }}
        form={form}
        fileList={fileList}
        setFileList={setFileList}
      />
      <ItemModal
        type="category"
        visible={isCategoryModalVisible}
        onOk={handleCategoryModalOk}
        onCancel={() => {
          setIsCategoryModalVisible(false);
          categoryForm.resetFields();
        }}
        form={categoryForm}
      />
      <ItemModal
        type="deleteItem"
        visible={isDeleteConfirmModalVisible}
        selectedItem={selectedItem}
        onOk={handleConfirmDelete}
        onCancel={() => setIsDeleteConfirmModalVisible(false)}
      />
      <ItemModal
        type="deleteCategory"
        visible={isDeleteCategoryModalVisible}
        selectedItem={selectedCategory}
        onOk={handleConfirmDeleteCategory}
        onCancel={() => setIsDeleteCategoryModalVisible(false)}
      />
    </div>
  );
}
