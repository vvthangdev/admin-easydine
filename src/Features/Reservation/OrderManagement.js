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
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/3 border-r">
        <UserSearch onSelectCustomer={handleSelectCustomer} />
      </div>
      <div className="w-2/3">
        <OrderList
          selectedCustomer={selectedCustomer}
          onClearFilter={handleClearFilter}
        />
      </div>
    </div>
  );
};

export default OrderManagements;