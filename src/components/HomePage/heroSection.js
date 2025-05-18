import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      px={{ xs: 2, md: 5 }}
      py={6}
      sx={{
        background: 'linear-gradient(to right, #fff7ed, #fff1d6)',
      }}
    >
      <Box display="flex" flexDirection="column" gap={3} maxWidth="500px" alignItems="center" textAlign="center">
        <Typography variant="h3" fontWeight="bold" color="text.primary">
          Quản lý
          <Typography component="span" variant="h3" color="orange" display="block" mt={1}>
            Nhà hàng của bạn
          </Typography>
          Một cách thật dễ dàng
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Hãy cùng trải nghiệm!
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: 'orange',
            color: '#fff',
            px: 4,
            py: 1.5,
            borderRadius: 9999,
            boxShadow: 4,
            '&:hover': {
              backgroundColor: '#fb923c',
              boxShadow: 6,
            },
          }}
          onClick={() => navigate('/login')}
        >
          Khám phá ngay
        </Button>
      </Box>

      <Box display={{ xs: 'none', md: 'block' }}>
        <Box
          component="img"
          src="/Assets/HomePage/breadsup.jpg"
          alt="Bánh mì ngon"
          sx={{
            width: 500,
            height: 500,
            objectFit: 'cover',
            borderRadius: 4,
            boxShadow: 6,
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
      </Box>
    </Box>
  );
}
