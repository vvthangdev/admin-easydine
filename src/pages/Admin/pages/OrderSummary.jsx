'use client';

import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { ShoppingCart, Users, DollarSign, CreditCard, XCircle, TrendingUp } from 'lucide-react';

export default function OrderSummary({ totalSummary }) {
  // Định dạng paymentMethods an toàn
  const formatPaymentMethods = () => {
    if (Array.isArray(totalSummary.paymentMethods)) {
      return totalSummary.paymentMethods.reduce((sum, item) => sum + (item.count || 0), 0) || 'N/A';
    }
    return totalSummary.paymentMethods || 'N/A';
  };

  // Định dạng cancelReasons an toàn
  const formatCancelReasons = () => {
    if (Array.isArray(totalSummary.cancelReasons)) {
      return totalSummary.cancelReasons.reduce((sum, item) => sum + (item.count || 0), 0) || 'N/A';
    }
    return totalSummary.cancelReasons || 'N/A';
  };

  const summaryCards = [
    {
      title: 'Tổng Số Đơn Hàng',
      value: totalSummary.totalOrders || 0,
      icon: ShoppingCart,
      color: '#0071e3',
      gradient: 'linear-gradient(135deg, #0071e3 0%, #005bb5 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(0, 113, 227, 0.1) 0%, rgba(0, 91, 181, 0.05) 100%)',
    },
    {
      title: 'Tổng Số Người Đặt',
      value: totalSummary.totalPeople || 0,
      icon: Users,
      color: '#34c759',
      gradient: 'linear-gradient(135deg, #34c759 0%, #28a745 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(52, 199, 89, 0.1) 0%, rgba(40, 167, 69, 0.05) 100%)',
    },
    {
      title: 'Tổng Doanh Thu',
      value: `${(totalSummary.totalRevenue || 0).toLocaleString()} VND`,
      icon: DollarSign,
      color: '#ff9500',
      gradient: 'linear-gradient(135deg, #ff9500 0%, #e6850e 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(255, 149, 0, 0.1) 0%, rgba(230, 133, 14, 0.05) 100%)',
    },
    {
      title: 'Tổng Thanh Toán',
      value: formatPaymentMethods(),
      icon: CreditCard,
      color: '#5856d6',
      gradient: 'linear-gradient(135deg, #5856d6 0%, #4c4bc4 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(88, 86, 214, 0.1) 0%, rgba(76, 75, 196, 0.05) 100%)',
    },
    {
      title: 'Tổng Hủy Đơn',
      value: formatCancelReasons(),
      icon: XCircle,
      color: '#ff2d55',
      gradient: 'linear-gradient(135deg, #ff2d55 0%, #e6294d 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(255, 45, 85, 0.1) 0%, rgba(230, 41, 77, 0.05) 100%)',
    },
  ];

  return (
    <Box sx={{ position: 'relative', zIndex: 1, mt: 2 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 3,
        p: 3,
        background: 'linear-gradient(135deg, #0071e3 0%, #005bb5 100%)',
        borderRadius: '12px',
        color: 'white',
        boxShadow: '0 8px 32px rgba(0, 113, 227, 0.3)',
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        }}>
          <TrendingUp size={24} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
            mb: 0.5
          }}>
            Tổng Quan Đơn Hàng
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Thống kê tổng hợp về tình hình đơn hàng
          </Typography>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        {summaryCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
              <Card
                sx={{
                  background: card.bgGradient,
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    '& .icon-container': {
                      transform: 'scale(1.1)',
                    },
                    '& .card-content': {
                      transform: 'translateY(-2px)',
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: card.gradient,
                  }
                }}
              >
                <CardContent sx={{ 
                  p: 3,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  position: 'relative',
                  zIndex: 1,
                }}>
                  {/* Icon Container */}
                  <Box
                    className="icon-container"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 64,
                      height: 64,
                      borderRadius: '16px',
                      background: card.gradient,
                      boxShadow: `0 8px 24px ${card.color}40`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <IconComponent size={28} color="white" />
                  </Box>

                  {/* Content */}
                  <Box className="card-content" sx={{ 
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    width: '100%'
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 500,
                        mb: 1,
                        fontSize: '0.875rem',
                        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        color: 'text.primary',
                        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                        fontSize: { xs: '1.5rem', sm: '1.75rem' },
                        lineHeight: 1.2,
                      }}
                    >
                      {card.value}
                    </Typography>
                  </Box>
                </CardContent>

                {/* Decorative Elements */}
                <Box sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: `${card.color}10`,
                  zIndex: 0,
                }} />
                <Box sx={{
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: `${card.color}05`,
                  zIndex: 0,
                }} />
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
