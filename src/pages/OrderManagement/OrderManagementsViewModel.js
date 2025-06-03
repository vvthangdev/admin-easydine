import { useState, useCallback } from "react";
import { message } from "antd";

const OrderManagementsViewModel = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleSelectCustomer = useCallback((customer) => {
    setSelectedCustomer(customer);
    message.success(`Đã chọn khách hàng: ${customer.name}`);
  }, []);

  const handleClearFilter = useCallback(() => {
    setSelectedCustomer(null);
    message.success("Đã xóa bộ lọc khách hàng");
  }, []);

  return {
    selectedCustomer,
    handleSelectCustomer,
    handleClearFilter,
  };
};

export default OrderManagementsViewModel;