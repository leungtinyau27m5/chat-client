import { createTheme } from "@mui/material";

export default createTheme({
  palette: {
    primary: {
      main: "#00A389",
      light: "#E0F4F1",
      contrastText: "#BFE8E1",
    },
    secondary: {
      main: "#5A68DF",
      light: "#DFE1F9",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "html, body": {
          margin: 0,
          padding: 0,
          height: "-webkit-fill-available",
        },
        "#root": {
          height: "100%",
        },
      },
    },
  },
});
