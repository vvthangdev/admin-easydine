"use client"

import React from "react"

import { Box, Typography, Grid, Paper, Button, Divider } from "@mui/material"
import { useNavigate } from "react-router-dom"
import StarIcon from "@mui/icons-material/Star"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import RestaurantIcon from "@mui/icons-material/Restaurant"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"

export default function WhyChoseUs() {
  const navigate = useNavigate()

  const features = [
    {
      id: 1,
      icon: <StarIcon sx={{ fontSize: "2.5rem", color: "#0071e3" }} />,
      title: "Chất Lượng Hàng Đầu",
      description: "Nguyên liệu tươi ngon được chọn lọc kỹ càng mỗi ngày",
      stat: "100%",
      statText: "Khách hàng hài lòng",
    },
    {
      id: 2,
      icon: <LocalShippingIcon sx={{ fontSize: "2.5rem", color: "#0071e3" }} />,
      title: "Giao Hàng Nhanh Chóng",
      description: "Giao hàng trong vòng 30 phút trong khu vực nội thành",
      stat: "30",
      statText: "Phút giao hàng",
    },
    {
      id: 3,
      icon: <RestaurantIcon sx={{ fontSize: "2.5rem", color: "#0071e3" }} />,
      title: "Đầu Bếp Chuyên Nghiệp",
      description: "Đội ngũ đầu bếp với hơn 10 năm kinh nghiệm",
      stat: "15+",
      statText: "Đầu bếp chuyên nghiệp",
    },
    {
      id: 4,
      icon: <EmojiEventsIcon sx={{ fontSize: "2.5rem", color: "#0071e3" }} />,
      title: "Món Ăn Đặc Sắc",
      description: "Menu đa dạng với các món ăn đặc trưng của nhiều vùng miền",
      stat: "50+",
      statText: "Món ăn độc đáo",
    },
  ]

  return (
    <Box
      py={10}
      px={{ xs: 2, md: 5 }}
      sx={{
        background: "linear-gradient(145deg, #f5f5f7 0%, #ffffff 100%)",
        position: "relative",
        overflow: "hidden",
        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at bottom right, rgba(0, 122, 255, 0.08), transparent 70%)",
          zIndex: 0,
        },
      }}
    >
      <Box textAlign="center" maxWidth="600px" mx="auto" mb={8} position="relative" zIndex={1}>
        <Typography
          variant="h4"
          fontWeight={700}
          color="#1d1d1f"
          gutterBottom
          sx={{ fontFamily: '"SF Pro Display", Roboto, sans-serif' }}
        >
          Tại Sao Chọn Chúng Tôi?
        </Typography>
        <Typography variant="body1" color="#86868b">
          Chúng tôi cam kết mang đến cho bạn những trải nghiệm ẩm thực tuyệt vời nhất với chất lượng phục vụ hàng đầu
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center" position="relative" zIndex={1}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={3} key={feature.id}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 24,
                background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                transition: "all 0.4s ease",
                "&:hover": {
                  background: "linear-gradient(145deg, #0071e3 0%, #42a5f5 100%)",
                  boxShadow: "0 12px 24px rgba(0,113,227,0.2)",
                  transform: "translateY(-8px)",
                  "& .feature-title": { color: "#ffffff" },
                  "& .feature-description": { color: "rgba(255, 255, 255, 0.9)" },
                  "& .feature-divider": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                  "& .feature-stat": { color: "#ffffff" },
                  "& .feature-stat-text": { color: "rgba(255, 255, 255, 0.7)" },
                  "& .feature-icon": { color: "#ffffff" },
                },
              }}
            >
              <Box mb={2}>{React.cloneElement(feature.icon, { className: "feature-icon" })}</Box>
              <Typography variant="h6" fontWeight={600} color="#1d1d1f" mb={1} className="feature-title">
                {feature.title}
              </Typography>
              <Typography variant="body2" color="#86868b" mb={2} className="feature-description">
                {feature.description}
              </Typography>
              <Divider sx={{ my: 2, bgcolor: "rgba(0, 0, 0, 0.1)" }} className="feature-divider" />
              <Typography variant="h5" color="#0071e3" fontWeight={700} className="feature-stat">
                {feature.stat}
              </Typography>
              <Typography variant="caption" color="#86868b" className="feature-stat-text">
                {feature.statText}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box mt={10} textAlign="center" position="relative" zIndex={1}>
        <Box
          sx={{
            background: "linear-gradient(145deg, #ffffff 0%, #f8f8fa 100%)",
            color: "#1d1d1f",
            p: 5,
            borderRadius: 24,
            maxWidth: "800px",
            mx: "auto",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.06)",
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={2} sx={{ fontFamily: '"SF Pro Display", Roboto, sans-serif' }}>
            Trải Nghiệm Ngay Hôm Nay
          </Typography>
          <Typography color="#86868b" mb={3}>
            Đặt bàn ngay để thưởng thức những món ăn tuyệt vời của chúng tôi
          </Typography>
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(145deg, #0071e3 0%, #42a5f5 100%)",
                color: "#ffffff",
                borderRadius: 28,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(0,113,227,0.2)",
                "&:hover": {
                  background: "linear-gradient(145deg, #0077ed 0%, #2196f3 100%)",
                  boxShadow: "0 6px 16px rgba(0,113,227,0.3)",
                },
                transition: "all 0.3s ease",
              }}
              onClick={() => navigate("/reservation")}
            >
              Đặt Bàn Ngay
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#0071e3",
                color: "#0071e3",
                borderRadius: 28,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  borderColor: "#0071e3",
                  background: "rgba(0, 113, 227, 0.05)",
                },
                transition: "all 0.3s ease",
              }}
              onClick={() => navigate("/menu")}
            >
              Xem Menu
            </Button>
          </Box>
        </Box>
      </Box>

      <Box
        mt={8}
        display="flex"
        justifyContent="center"
        gap={2}
        flexWrap="wrap"
        color="#86868b"
        fontSize="0.875rem"
        textAlign="center"
        position="relative"
        zIndex={1}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <StarIcon sx={{ color: "#0071e3" }} />
          <Typography>4.9/5 đánh giá</Typography>
        </Box>
        <Box>•</Box>
        <Box>1000+ khách hàng hài lòng</Box>
        <Box>•</Box>
        <Box>Chứng nhận vệ sinh an toàn thực phẩm</Box>
      </Box>
    </Box>
  )
}
