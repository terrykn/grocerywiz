import { createTheme } from '@mui/material/styles';

export const themeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#e53935',
    },
    secondary: {
      main: '#fbc02d',
    },
  },
  typography: {
    fontFamily: 'DM Sans',
    h1: {
      fontFamily: 'Montserrat',
    },
    h2: {
      fontFamily: 'Montserrat',
    },
    h3: {
      fontFamily: 'Montserrat',
    },
    h4: {
      fontFamily: 'Montserrat',
    },
    h5: {
      fontFamily: 'Montserrat',
    },
    h6: {
      fontFamily: 'Montserrat',
    },
    h7: {
        fontFamily: 'Montserrat',
    }
  },
};

const theme = createTheme(themeOptions);

export default theme;