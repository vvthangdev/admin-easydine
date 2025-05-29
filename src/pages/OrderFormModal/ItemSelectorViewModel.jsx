import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { itemAPI } from "../../services/apis/Item";

const ItemSelectorViewModel = ({ setSelectedItems, setMenuItems }) => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchCategories = async () => {
    try {
      const categoriesData = await itemAPI.getAllCategories();
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Không thể tải danh mục món ăn");
      setCategories([]);
    }
  };

  const fetchMenuItems = useCallback(async (name = "", categoryId = null) => {
    setLoading(true);
    try {
      let items;
      if (categoryId) {
        items = await itemAPI.filterItemsByCategory(categoryId);
      } else if (name) {
        items = await itemAPI.searchItem({ name });
      } else {
        items = await itemAPI.getAllItem();
      }
      setMenuItems(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error("Không thể tải danh sách món ăn");
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  }, [setMenuItems]);

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, [fetchMenuItems]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMenuItems(searchTerm, selectedCategory);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory, fetchMenuItems]);

  const handleAddItem = (itemData) => {
    setSelectedItems((prev) => {
      const existing = prev.find(
        (item) => item.id === itemData.id && item.size === itemData.size
      );
      if (existing) {
        return prev.map((item) =>
          item.id === itemData.id && item.size === itemData.size
            ? { ...item, quantity: item.quantity + itemData.quantity, note: itemData.note }
            : item
        );
      }
      return [...prev, itemData];
    });
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  const showItemDetails = (item) => {
    setSelectedItem({
      id: item._id,
      name: item.name,
      price: item.price,
      sizes: item.sizes || [],
    });
    setIsModalVisible(true);
  };

  const showDescriptionModal = (description) => {
    setSelectedDescription(description);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
    setSelectedDescription("");
  };

  return {
    categories,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    loading,
    isModalVisible,
    selectedDescription,
    selectedItem,
    handleAddItem,
    showItemDetails,
    showDescriptionModal,
    handleModalClose,
  };
};

export default ItemSelectorViewModel;