import { useRef, useState } from "react";
import {
  Avatar,
  Box,
  ButtonBase,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  styled,
  Tooltip,
  paperClasses,
  listItemTextClasses,
  typographyClasses,
} from "@mui/material";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import { useRecoilState } from "recoil";
import { userSelector } from "src/data/user.atom";
import { getProfilePic } from "src/api/chat";
import clsx from "clsx";
import { menuItems } from "./constants";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import MenuBoard from "./MenuBoard";
import UserStatus from "./UserStatus";
import GroupChatList from "../chatList/GroupChatList";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const StyledBox = styled(Box)(({ theme }) => ({
  width: 380,
  display: "grid",
  gridTemplateColumns: "60px 1fr",
  height: "100%",
  [theme.breakpoints.down("sm")]: {
    width: "85vw",
  },
  "& .menu-bar": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing(3.5),
    paddingBottom: theme.spacing(3.5),
    borderCollapse: "collapse",
    [theme.breakpoints.down("sm")]: {
      paddingTop: theme.spacing(1.8),
      paddingBottom: theme.spacing(1.8),
    },
    "& > .header": {},
    "& > .body": {
      flex: 1,
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      "& .menu-item": {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        borderRight: "2px solid transparent",
        borderCollapse: "collapse",
        transition: "all .3s ease-in-out",
        "& button": {
          minWidth: 0,
          width: 42,
          height: 42,
          borderRadius: 12,
          color: "darkslategrey",
        },
        "&.active": {
          borderRight: `2px solid ${theme.palette.primary.main}`,
          "& button": {
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.light,
          },
        },
        "&:not(:last-of-type)": {
          marginBottom: theme.spacing(0.5),
        },
      },
    },
    "& > .trailing": {},
  },
}));

const StyledMenu = styled(Menu)(() => ({
  [`& .${paperClasses.root}`]: {
    borderRadius: 12,
    [`& .${listItemTextClasses.root}`]: {
      [`& .${typographyClasses.root}`]: {
        fontSize: "0.85rem",
      },
    },
  },
}));

const MainMenu = () => {
  const [userData, setUserData] = useRecoilState(userSelector);
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const trailingRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setShowMenu((state) => !state);

  const logout = () => {
    setUserData(null);
    setTimeout(() => {
      window.location.reload();
    });
  };

  return (
    <StyledBox component="aside" className="main-menu">
      <Box className="menu-bar">
        <Box className="header">
          <AcUnitRoundedIcon
            sx={{
              color: (theme) => theme.palette.primary.dark,
              width: 32,
              height: 32,
            }}
          />
        </Box>
        <Box className="body">
          {menuItems.map((item) => (
            <Box
              key={item.path}
              className={clsx("menu-item", {
                active: location.pathname.match(item.path),
              })}
            >
              <Link to={item.path}>
                <ButtonBase>{item.icon}</ButtonBase>
              </Link>
            </Box>
          ))}
        </Box>
        <Box className="trailing" ref={trailingRef}>
          {userData && (
            <Tooltip title={userData.username}>
              <ButtonBase sx={{ borderRadius: "50%" }} onClick={toggleMenu}>
                <Avatar
                  src={
                    userData.profile_pic
                      ? getProfilePic(userData.profile_pic)
                      : ""
                  }
                />
              </ButtonBase>
            </Tooltip>
          )}
        </Box>
      </Box>
      {userData && (
        <MenuBoard>
          <Box className="header">
            <UserStatus userData={userData} />
          </Box>
          <Box className="body">
            {location.pathname.match("/group") && <GroupChatList />}
          </Box>
        </MenuBoard>
      )}
      <StyledMenu
        open={showMenu}
        anchorEl={trailingRef.current}
        onClose={() => toggleMenu()}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: 80,
          horizontal: -12,
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <AccountCircleRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemIcon
            sx={{
              color: (theme) => theme.palette.error.main,
            }}
          >
            <LogoutRoundedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            color="error"
            sx={{
              color: (theme) => theme.palette.error.main,
            }}
          />
        </MenuItem>
      </StyledMenu>
    </StyledBox>
  );
};

export default MainMenu;
