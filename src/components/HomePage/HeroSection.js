import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import breadsup from '../../assets/images/breadsup.jpg';

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
        background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f7 100%)',
        transition: 'all 0.3s',
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at top left, rgba(0, 122, 255, 0.08), transparent 70%)',
          zIndex: 0,
        },
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={3}
        maxWidth="500px"
        alignItems="center"
        textAlign="center"
        zIndex={1}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          color="#1d1d1f"
          sx={{ fontFamily: '"SF Pro Display", Roboto, sans-serif' }}
        >
          Quản lý
          <Typography
            component="span"
            variant="h3"
            color="#0071e3"
            display="block"
            mt={1}
            fontWeight={700}
          >
            Nhà hàng của bạn
          </Typography>
          Một cách thật dễ dàng
        </Typography>
        <Typography
          variant="h6"
          color="#86868b"
          sx={{ fontWeight: 400 }}
        >
          Hãy cùng trải nghiệm!
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            background: 'linear-gradient(145deg, #0071e3 0%, #42a5f5 100%)',
            color: '#ffffff',
            px: 4,
            py: 1.5,
            borderRadius: 28,
            boxShadow: '0 4px 12px rgba(0,113,227,0.2)',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(145deg, #0077ed 0%, #2196f3 100%)',
              boxShadow: '0 6px 16px rgba(0,113,227,0.3)',
            },
            transition: 'all 0.3s ease',
          }}
          onClick={() => navigate('/login')}
        >
          Khám phá ngay
        </Button>
      </Box>

      <Box display={{ xs: 'none', md: 'block' }} zIndex={1}>
        <Box
          component="img"
          src={breadsup}
          alt="Bánh mì ngon"
          sx={{
            width: 500,
            height: 500,
            objectFit: 'cover',
            borderRadius: 24,
            boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'transform 0.5s, box-shadow 0.5s',
            '&:hover': {
              transform: 'scale(1.03) translateY(-8px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            },
          }}
          onError={() => console.error('Không tải được ảnh breadsup.jpg')}
        />
      </Box>
    </Box>
  );
}
