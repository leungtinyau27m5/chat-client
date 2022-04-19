import { ReactNode } from "react";
import { Box, styled, avatarClasses, IconButton } from "@mui/material";
import { UserState } from "src/data/user.atom";
import SettingsIcon from "@mui/icons-material/Settings";

const StyledMenuBoard = styled(Box)(({ theme }) => ({
  position: "relative",
  paddingTop: theme.spacing(3.5),
  paddingBottom: theme.spacing(3.5),
  [theme.breakpoints.down("sm")]: {
    paddingTop: theme.spacing(1.8),
    paddingBottom: theme.spacing(1.8),
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
  "& .header": {
    height: "20vh",
    position: "relative",
    padding: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(0.8),
    },
  },
  "& .body": {
    height: "80vh",
    overflowY: "auto",
  },
}));

const MenuBoard = (props: MenuBoardProps) => {
  const { children } = props;
  return (
    <StyledMenuBoard className="menu-board">
      <Box className="setting">
        <IconButton>
          <SettingsIcon />
        </IconButton>
      </Box>
      {children}
    </StyledMenuBoard>
  );
};

export interface MenuBoardProps {
  children?: ReactNode;
}

export default MenuBoard;
