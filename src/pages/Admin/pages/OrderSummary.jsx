'use client';

import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { ShoppingCart, Users, DollarSign, CreditCard, XCircle } from 'lucide-react';
import { theme } from '../../../styles/index';

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

  return (
    <Grid container spacing={16} sx={{ position: 'relative', zIndex: 1, mt: '16px' }}>
      <Grid item xs={12} sm={4}>
        <Card
          sx={{
            ...theme.components.card.main,
            p: '12px',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: theme.shadows[6],
            },
          }}
        >
          <CardContent sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: `${theme.colors.primary.main}33`, // 20% opacity
                mx: 'auto',
              }}
            >
              <ShoppingCart color={theme.colors.primary.main} size={28} />
            </Box>
            <Typography variant="h6" sx={theme.components.text.body} color={theme.colors.neutral[500]}>
              Tổng Số Đơn Hàng
            </Typography>
            <Typography variant="h4" sx={theme.components.text.heading} color={theme.colors.neutral[900]}>
              {totalSummary.totalOrders || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card
          sx={{
            ...theme.components.card.main,
            p: '12px',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: theme.shadows[6],
            },
          }}
        >
          <CardContent sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: `${theme.colors.primary.main}33`,
                mx: 'auto',
              }}
            >
              <Users color={theme.colors.primary.main} size={28} />
            </Box>
            <Typography variant="h6" sx={theme.components.text.body} color={theme.colors.neutral[500]}>
              Tổng Số Người Đặt
            </Typography>
            <Typography variant="h4" sx={theme.components.text.heading} color={theme.colors.neutral[900]}>
              {totalSummary.totalPeople || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card
          sx={{
            ...theme.components.card.main,
            p: '12px',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: theme.shadows[6],
            },
          }}
        >
          <CardContent sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: `${theme.colors.primary.main}33`,
                mx: 'auto',
              }}
            >
              <DollarSign color={theme.colors.primary.main} size={28} />
            </Box>
            <Typography variant="h6" sx={theme.components.text.body} color={theme.colors.neutral[500]}>
              Tổng Doanh Thu
            </Typography>
            <Typography variant="h4" sx={theme.components.text.heading} color={theme.colors.neutral[900]}>
              {(totalSummary.totalRevenue || 0).toLocaleString()} VND
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card
          sx={{
            ...theme.components.card.main,
            p: '12px',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: theme.shadows[6],
            },
          }}
        >
          <CardContent sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: `${theme.colors.primary.main}33`,
                mx: 'auto',
              }}
            >
              <CreditCard color={theme.colors.primary.main} size={28} />
            </Box>
            <Typography variant="h6" sx={theme.components.text.body} color={theme.colors.neutral[500]}>
              Tổng Thanh Toán
            </Typography>
            <Typography variant="h4" sx={theme.components.textColor} color={theme.colors.neutral[900]}>
              {formatPaymentMethods()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card
          sx={{
            ...theme.components.card.main,
            p: '12px',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: theme.shadows[6],
            },
          }}
        >
          <CardContent sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: `${theme.colors.primary.main}33`,
                mx: 'auto',
              }}
            >
              <XCircle color={theme.colors.primary.main} size={28} />
            </Box>
            <Typography variant="h6" sx={theme.components.text.body} color={theme.colors.neutral[500]}>
              Tổng Hủy Đơn
            </Typography>
            <Typography variant="h4" sx={theme.components.text.heading} color={theme.colors.neutral[900]}>
              {formatCancelReasons()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};