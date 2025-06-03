"use client"

import { useState } from "react"
import { Box } from "@mui/material"
import { message } from "antd"
import OrderSearch from "./UserSearch"
import OrderListView from "./OrderListView"

const OrderManagementView = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer)
    message.success(`Đã chọn khách hàng: ${customer.name}`)
  }

  const handleClearFilter = () => {
    setSelectedCustomer(null)
    message.success("Đã xóa bộ lọc khách hàng")
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(145deg, #f5f5f7 0%, #ffffff 100%)",
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
      <Box
        sx={{
          width: "25%",
          borderRight: "1px solid rgba(0, 0, 0, 0.05)",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          p: 3,
          position: "relative",
          zIndex: 1,
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
        }}
      >
        <OrderSearch onSelectCustomer={handleSelectCustomer} />
      </Box>
      <Box
        sx={{
          width: "75%",
          p: 3,
          position: "relative",
          zIndex: 1,
        }}
      >
        <OrderListView selectedCustomer={selectedCustomer} onClearFilter={handleClearFilter} />
      </Box>
    </Box>
  )
}

export default OrderManagementView
