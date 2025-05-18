import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f97316', // orange-500
    },
  },
  typography: {
    fontFamily: ['"Inter"', 'Roboto', 'sans-serif'].join(','),
  },
});

export default theme;
