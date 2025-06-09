import { useState } from 'react';
import { Box } from '@mui/material';
import { message } from 'antd';
import OrderSearch from './UserSearch';
import OrderListView from './OrderListView';
import { useAppleStyles } from '../../theme/theme-hooks';

const OrderManagementView = () => {
  const styles = useAppleStyles();
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    message.success(`Đã chọn khách hàng: ${customer.name}`);
  };

  const handleClearFilter = () => {
    setSelectedCustomer(null);
    message.success('Đã xóa bộ lọc khách hàng');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: styles.gradients?.light || 'linear-gradient(145deg, #f5f5f7 0%, #ffffff 100%)',
        position: 'relative',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: styles.gradients?.radial || 'radial-gradient(circle at top left, rgba(0, 122, 255, 0.05), transparent 70%)',
          zIndex: 0,
        },
      }}
    >
      <Box
        sx={{
          width: '25%',
          borderRight: `1px solid ${styles.colors?.neutral?.[100] || 'rgba(0, 0, 0, 0.05)'}`,
          background: styles.colors?.background?.paper || 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          p: styles.spacing(3),
          position: 'relative',
          zIndex: 1,
          boxShadow: styles.shadows?.sm,
        }}
      >
        <OrderSearch onSelectCustomer={handleSelectCustomer} />
      </Box>
      <Box
        sx={{
          width: '75%',
          p: styles.spacing(3),
          position: 'relative',
          zIndex: 1,
        }}
      >
        <OrderListView selectedCustomer={selectedCustomer} onClearFilter={handleClearFilter} />
      </Box>
    </Box>
  );
};

export default OrderManagementView;