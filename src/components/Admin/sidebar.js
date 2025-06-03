"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Box, IconButton, Typography, Avatar } from "@mui/material"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"
import { LayoutDashboard, Table, ShoppingBag, MenuIcon, Users, MessageSquare, Home } from "lucide-react"

export default function Sidebar({ onCollapseChange }) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [user, setUser] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    onCollapseChange(isCollapsed)
  }, [isCollapsed, onCollapseChange])

  const menuItems = [
    {
      path: "/admin",
      label: "Tổng quan",
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: "/admin/tables",
      label: "Quản lý bàn",
      icon: <Table size={20} />,
    },
    {
      path: "/admin/orders",
      label: "Đơn hàng",
      icon: <ShoppingBag size={20} />,
    },
    {
      path: "/admin/items",
      label: "Quản lý menu",
      icon: <MenuIcon size={20} />,
    },
    {
      path: "/admin/users",
      label: "Quản lý người dùng",
      icon: <Users size={20} />,
    },
    {
      path: "/admin/cancel-items",
      label: "Quản lý liên hệ",
      icon: <MessageSquare size={20} />,
    },
  ]

  return (
    <Box
      sx={{
        width: isCollapsed ? "72px" : "256px",
        height: "calc(100vh - 64px)", // Adjust for fixed header
        background: "linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)",
        color: "#1d1d1f",
        transition: "width 0.3s ease-in-out",
        borderRight: "1px solid rgba(0, 0, 0, 0.05)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        position: "fixed", // Ensure sidebar stays fixed
        top: "64px", // Align below header
        overflow: "hidden", // Prevent content overflow
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        {!isCollapsed && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
            <Avatar
              src={user?.avatar || "/Assets/Header/avtprivate.jpg"}
              alt="Admin"
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "1px solid rgba(0, 113, 227, 0.2)",
                transition: "all 0.3s",
                "&:hover": { borderColor: "rgba(0, 113, 227, 0.5)" },
              }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#1d1d1f",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.username}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#86868b",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Administrator
              </Typography>
            </Box>
          </Box>
        )}
        <IconButton
          onClick={() => setIsCollapsed(!isCollapsed)}
          sx={{
            p: 1,
            borderRadius: "50%",
            bgcolor: "rgba(0, 113, 227, 0.1)",
            color: "#0071e3",
            "&:hover": {
              bgcolor: "rgba(0, 113, 227, 0.2)",
              transform: "scale(1.05)",
            },
            flexShrink: 0,
            transition: "all 0.2s ease",
          }}
        >
          {isCollapsed ? <RightOutlined style={{ fontSize: "16px" }} /> : <LeftOutlined style={{ fontSize: "16px" }} />}
        </IconButton>
      </Box>

      <Box sx={{ mt: 2, px: 1, overflowY: "auto" }}>
        {menuItems.map((item, index) => (
          <Link key={index} to={item.path} style={{ textDecoration: "none" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 1.5,
                py: 1.2,
                my: 0.5,
                mx: 0.5,
                borderRadius: 3,
                color: location.pathname === item.path ? "#0071e3" : "#86868b",
                bgcolor: location.pathname === item.path ? "rgba(0, 113, 227, 0.1)" : "transparent",
                boxShadow: location.pathname === item.path ? "0 2px 8px rgba(0, 113, 227, 0.15)" : "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(0, 113, 227, 0.05)",
                  color: "#0071e3",
                  transform: "translateX(3px)",
                },
                justifyContent: isCollapsed ? "center" : "flex-start",
                minHeight: "44px",
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: location.pathname === item.path ? "#0071e3" : "#86868b",
                }}
              >
                {item.icon}
              </Box>
              {!isCollapsed && (
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    flex: 1,
                  }}
                >
                  {item.label}
                </Typography>
              )}
            </Box>
          </Link>
        ))}
      </Box>

      <Box sx={{ position: "absolute", bottom: 0, width: "100%", p: 2, borderTop: "1px solid rgba(0, 0, 0, 0.05)" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 1.5,
              py: 1.2,
              mx: 0.5,
              borderRadius: 3,
              color: "#86868b",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(0, 113, 227, 0.05)",
                color: "#0071e3",
                transform: "translateX(3px)",
              },
              justifyContent: isCollapsed ? "center" : "flex-start",
              minHeight: "44px",
            }}
          >
            <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Home size={20} />
            </Box>
            {!isCollapsed && (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Về trang chủ
              </Typography>
            )}
          </Box>
        </Link>
      </Box>
    </Box>
  )
}
