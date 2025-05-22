import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { itemAPI } from "../../services/apis/Item";

const ItemSelectorViewModel = ({ setSelectedItems, menuItems, setMenuItems }) => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

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

  const handleAddItem = (record) => {
    setSelectedItems((prev) => {
      const defaultSize = record.sizes?.length > 0 ? record.sizes[0].name : null;
      const price = defaultSize ? record.sizes[0].price : record.price;
      const existing = prev.find(
        (item) => item.id === record._id && item.size === defaultSize
      );
      if (existing) {
        return prev.map((item) =>
          item.id === record._id && item.size === defaultSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: record._id,
          name: record.name,
          price: price,
          quantity: 1,
          size: defaultSize,
          note: "",
        },
      ];
    });
  };

  const showDescriptionModal = (description) => {
    setSelectedDescription(description);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
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
    handleAddItem,
    showDescriptionModal,
    handleModalClose,
  };
};

export default ItemSelectorViewModel;