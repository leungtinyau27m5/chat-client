import { CssBaseline, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { useRoutes } from "react-router-dom";
import myRoutes from "./utils/router";
import theme from "./utils/theme";
import "src/assets/styles/global.scss";

function App() {
  const routes = useRoutes(myRoutes);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={5}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {routes}
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
