import React, { useState } from "react";
import UserSearch from "./UserSearch";
import OrderList from "./OrderList";
import { message } from "antd";

const OrderManagements = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    message.success(`Đã chọn khách hàng: ${customer.name}`);
  };

  const handleClearFilter = () => {
    setSelectedCustomer(null);
    message.success("Đã xóa bộ lọc khách hàng");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-1/4 border-r border-gray-200 bg-white/80 backdrop-blur-md p-4">
        <UserSearch onSelectCustomer={handleSelectCustomer} />
      </div>
      <div className="w-3/4 p-4">
        <OrderList
          selectedCustomer={selectedCustomer}
          onClearFilter={handleClearFilter}
        />
      </div>
    </div>
  );
};

export default OrderManagements;