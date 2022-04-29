import { ReactNode } from "react";
import { Box, styled, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

const StyledMenuBoard = styled(Box)(({ theme }) => ({
  position: "relative",
  paddingTop: theme.spacing(3.5),
  // paddingBottom: theme.spacing(3.5),
  borderLeft: "1px solid grey",
  borderTopLeftRadius: 20,
  borderBottomLeftRadius: 20,
  borderCollapse: "collapse",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("sm")]: {
    paddingTop: theme.spacing(1.8),
    // paddingBottom: theme.spacing(1.8),
  },
  "& .setting": {
    position: "absolute",
    top: theme.spacing(3.5),
    right: theme.spacing(3.5),
    zIndex: 1,
    [theme.breakpoints.down("sm")]: {
      top: theme.spacing(1.8),
      right: theme.spacing(1.8),
    },
  },
  "& > .header": {
    height: "fit-content",
    position: "relative",
    padding: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(0.8),
    },
  },
  "& > .body": {
    flex: 1,
    display: "flex",
    maxHeight: "calc(100vh - 258px)",
    // overflow: "auto",
    [theme.breakpoints.down("sm")]: {
      maxHeight: "calc(100vh - 225px)",
    },
  },
}));

const MenuBoard = (props: MenuBoardProps) => {
  const { children } = props;
  return (
    <StyledMenuBoard className="menu-board">
      {/* <Box className="setting">
        <IconButton>
          <SettingsIcon />
        </IconButton>
      </Box> */}
      {children}
    </StyledMenuBoard>
  );
};

export interface MenuBoardProps {
  children?: ReactNode;
}

export default MenuBoard;
