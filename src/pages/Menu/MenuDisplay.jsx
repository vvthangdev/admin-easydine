import React, { useEffect, useState } from "react";
import {
  message,
  Input,
  Select,
  Card,
  Image,
  Row,
  Col,
  Typography,
  Spin,
} from "antd";
import { itemAPI } from "../../services/apis/Item";

const { Option } = Select;
const { Title, Text } = Typography;

const MenuDisplay = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const tableId = localStorage.getItem("tableId");

  // Hàm lấy danh sách món ăn
  const fetchMenuItems = async (categoryId = null) => {
    if (!tableId) {
      message.error(error.message || "Không tìm thấy ID bàn");
      return;
    }

    setLoading(true);
    try {
      let response = categoryId
        ? await itemAPI.filterItemsByCategory(categoryId)
        : await itemAPI.getAllItem();
      console.log("Menu items:", response);
      setMenuItems(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      message.error(error.message || "Lỗi khi tải danh sách món ăn");
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy danh sách danh mục
  const fetchCategories = async () => {
    try {
      const response = await itemAPI.getAllCategories();
      console.log("Categories:", response);
      setCategories(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error(error.message || "Lỗi khi tải danh sách danh mục");
      setCategories([]);
    }
  };

  // Hàm tìm kiếm theo tên
  const handleSearchByName = async (name) => {
    setSearchTerm(name);
    setLoading(true);
    try {
      if (!name) {
        fetchMenuItems(filterCategory);
      } else {
        const response = await itemAPI.searchItem({ name });
        console.log("Search results:", response);
        setMenuItems(Array.isArray(response) ? response : []);
      }
    } catch (error) {
      console.error("Error searching items:", error);
      message.error(error.message || "Lỗi khi tìm kiếm món ăn");
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lọc theo danh mục
  const handleFilterByCategory = (categoryId) => {
    setFilterCategory(categoryId);
    fetchMenuItems(categoryId === "all" ? null : categoryId);
  };

  // Lọc món ăn theo searchTerm (client-side filtering để hỗ trợ thêm)
  const filteredItems = menuItems.filter((item) =>
    item.nameNoAccents.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (tableId) {
      fetchMenuItems();
      fetchCategories();
    } else {
      message.error(
        error.message || "Vui lòng truy cập qua đường dẫn hợp lệ với ID bàn"
      );
    }
  }, [tableId]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col">
      <Title level={2} className="mb-4">
        Menu cho bàn {tableId}
      </Title>
      {tableId ? (
        <>
          {/* Thanh tìm kiếm và lọc danh mục */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} md={8}>
              <Input.Search
                placeholder="Tìm kiếm món ăn"
                onSearch={handleSearchByName}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Chọn danh mục"
                onChange={handleFilterByCategory}
                style={{ width: "100%" }}
                allowClear
                value={filterCategory}
              >
                <Option value="all">Tất cả</Option>
                {categories.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>

          {/* Hiển thị danh sách món ăn */}
          {loading ? (
            <Spin size="large" className="flex justify-center my-8" />
          ) : filteredItems.length > 0 ? (
            <Row gutter={[16, 16]}>
              {filteredItems.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
                  <Card
                    hoverable
                    cover={
                      <Image
                        src={item.image}
                        alt={item.name}
                        preview={false}
                        style={{ height: 200, objectFit: "cover" }}
                      />
                    }
                  >
                    <Card.Meta
                      title={item.name}
                      description={
                        <>
                          <Text strong>
                            Giá: {item.price.toLocaleString()} VNĐ
                          </Text>
                          <br />
                          {item.sizes && item.sizes.length > 0 && (
                            <>
                              <Text>Kích thước: </Text>
                              {item.sizes.map((size) => (
                                <Text key={size._id}>
                                  {size.name} ({size.price.toLocaleString()}{" "}
                                  VNĐ)
                                  {size !== item.sizes[item.sizes.length - 1]
                                    ? ", "
                                    : ""}
                                </Text>
                              ))}
                              <br />
                            </>
                          )}
                          <Text>
                            Danh mục:{" "}
                            {item.categories.map((cat) => cat.name).join(", ")}
                          </Text>
                          <br />
                          {item.description && (
                            <Text>Mô tả: {item.description}</Text>
                          )}
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Text>Không tìm thấy món ăn nào.</Text>
          )}
        </>
      ) : (
        <Text type="danger">
          Không tìm thấy thông tin bàn. Vui lòng truy cập lại.
        </Text>
      )}
    </div>
  );
};

export default MenuDisplay;
