import React, { useState } from "react";
import { Table, Button, Input, Space } from "antd";
import { userAPI } from "../../services/apis/User";

const { Search: SearchInput } = Input;

const UserSearch = ({ onSelectCustomer }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchUsers = async (query) => {
    if (!query || query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await userAPI.searchUsers(query);
      setSearchResults(response);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchUsers(value);
  };

  const columns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => handleSelectCustomer(record)}>
          Chọn
        </Button>
      ),
    },
  ];

  const handleSelectCustomer = (customer) => {
    setSearchTerm("");
    setSearchResults([]);
    onSelectCustomer(customer);
  };

  return (
    <div className="p-4 bg-white h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Tìm kiếm khách hàng</h2>
      <SearchInput
        placeholder="Tìm kiếm theo tên, số điện thoại, địa chỉ"
        value={searchTerm}
        onChange={handleSearch}
        style={{ width: "100%", marginBottom: 16 }}
      />
      {searchResults.length > 0 && (
        <Table
          columns={columns}
          dataSource={searchResults}
          rowKey="_id"
          pagination={false}
          size="small"
        />
      )}
    </div>
  );
};

export default UserSearch;