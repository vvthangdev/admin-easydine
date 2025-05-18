import { Box, Typography, Grid, Paper, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function WhyChoseUs() {
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      icon: '🌟',
      title: 'Chất Lượng Hàng Đầu',
      description: 'Nguyên liệu tươi ngon được chọn lọc kỹ càng mỗi ngày',
      stat: '100%',
      statText: 'Khách hàng hài lòng',
    },
    {
      id: 2,
      icon: '🚚',
      title: 'Giao Hàng Nhanh Chóng',
      description: 'Giao hàng trong vòng 30 phút trong khu vực nội thành',
      stat: '30',
      statText: 'Phút giao hàng',
    },
    {
      id: 3,
      icon: '👨‍🍳',
      title: 'Đầu Bếp Chuyên Nghiệp',
      description: 'Đội ngũ đầu bếp với hơn 10 năm kinh nghiệm',
      stat: '15+',
      statText: 'Đầu bếp chuyên nghiệp',
    },
    {
      id: 4,
      icon: '🏆',
      title: 'Món Ăn Đặc Sắc',
      description: 'Menu đa dạng với các món ăn đặc trưng của nhiều vùng miền',
      stat: '50+',
      statText: 'Món ăn độc đáo',
    },
  ];

  return (
    <Box
      py={10}
      px={{ xs: 2, md: 5 }}
      sx={{ background: 'linear-gradient(to bottom, #fff, #fff7ed)' }}
    >
      <Box textAlign="center" maxWidth="600px" mx="auto" mb={8}>
        <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
          Tại Sao Chọn Chúng Tôi?
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Chúng tôi cam kết mang đến cho bạn những trải nghiệm ẩm thực tuyệt vời nhất
          với chất lượng phục vụ hàng đầu
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={3} key={feature.id}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 2,
                transition: '0.3s',
                '&:hover': { boxShadow: 6 },
              }}
            >
              <Typography fontSize="2rem" mb={2}>
                {feature.icon}
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="text.primary" mb={1}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {feature.description}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h5" color="primary.main" fontWeight="bold">
                {feature.stat}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {feature.statText}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box mt={10} textAlign="center">
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            p: 5,
            borderRadius: 3,
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Trải Nghiệm Ngay Hôm Nay
          </Typography>
          <Typography color="white" mb={3}>
            Đặt bàn ngay để thưởng thức những món ăn tuyệt vời của chúng tôi
          </Typography>
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                borderRadius: 50,
                px: 4,
                py: 1.5,
                '&:hover': { bgcolor: '#fff7ed' },
              }}
              onClick={() => navigate('/reservation')}
            >
              Đặt Bàn Ngay
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: 'white',
                color: 'white',
                borderRadius: 50,
                px: 4,
                py: 1.5,
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
              }}
              onClick={() => navigate('/menu')}
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
        color="text.disabled"
        fontSize="0.875rem"
        textAlign="center"
      >
        <Box display="flex" alignItems="center" gap={1}>
          ⭐ <Typography>4.9/5 đánh giá</Typography>
        </Box>
        <Box>•</Box>
        <Box>1000+ khách hàng hài lòng</Box>
        <Box>•</Box>
        <Box>Chứng nhận vệ sinh an toàn thực phẩm</Box>
      </Box>
    </Box>
  );
}