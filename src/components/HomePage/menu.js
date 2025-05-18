import { useEffect, useState } from 'react';
import { itemAPI } from '../../services/apis/Item';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Rating,
} from '@mui/material';

export default function Menu() {
  const [listItems, setListItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Tất Cả');

  const categories = ['Tất Cả', 'Món Truyền Thống', 'Món Nổi Tiếng', 'Ăn Nhanh', 'Món Chính'];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await itemAPI.getAllItem();
      setListItems(response);
    } catch (error) {
      message.error('Lỗi khi tải menu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredItems = activeCategory === 'Tất Cả'
    ? listItems
    : listItems.filter(item => item.category === activeCategory);

  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 10 }, bgcolor: 'background.paper' }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" fontWeight="bold" color="text.primary" gutterBottom>
          Món Ăn Phổ Biến
        </Typography>
        <Typography variant="body1" color="text.secondary" maxWidth="600px" mx="auto">
          Khám phá những món ăn được yêu thích nhất tại nhà hàng chúng tôi, được chế biến từ những nguyên liệu tươi ngon nhất
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 6, flexWrap: 'wrap' }}>
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => setActiveCategory(category)}
            variant={activeCategory === category ? 'contained' : 'outlined'}
            color="primary"
            sx={{
              borderRadius: 50,
              textTransform: 'none',
              '&:hover': { bgcolor: activeCategory === category ? 'primary.dark' : 'grey.200' },
            }}
          >
            {category}
          </Button>
        ))}
      </Box>

      <Grid container spacing={3}>
        {filteredItems.slice(0, 4).map((item) => {
          const rating = typeof item.rating === 'number' ? item.rating : 5;
          return (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 1,
                  '&:hover': { boxShadow: 6, transform: 'scale(1.02)', transition: 'all 0.3s' },
                  overflow: 'hidden',
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image}
                  alt={item.name}
                  sx={{ transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.1)' } }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(0,0,0,0.4)',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  <Button variant="contained" color="primary" sx={{ borderRadius: 50 }}>
                    Đặt Ngay
                  </Button>
                </Box>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                      {item.name}
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      {typeof item.price === 'number' ? item.price.toLocaleString('vi-VN') : item.price} Đ
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Rating value={rating} precision={0.5} readOnly sx={{ color: 'warning.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      ({item.reviews || 0} đánh giá)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.category}
                    </Typography>
                    <Button component={Link} to={`/menu/${item.id}`} color="primary" size="small">
                      Xem chi tiết →
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Button
          component={Link}
          to="/menu"
          variant="contained"
          color="primary"
          sx={{ px: 4, py: 1.5, borderRadius: 50, '&:hover': { bgcolor: 'primary.dark' } }}
        >
          Xem Tất Cả Món Ăn
        </Button>
      </Box>
    </Box>
  );
}