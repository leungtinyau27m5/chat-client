import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  styled,
  Toolbar,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useCallback, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { getByToken } from "src/api/chat";
import { ExpressCodeMap } from "src/api/express.proto";
import { appbarAtom, menuAtom } from "src/data/menu.atom";
import { userSelector } from "src/data/user.atom";
import ChatSocketProvider from "src/providers/socket.io/chat";
import { getCookie } from "src/utils/storages";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";

const StyledBox = styled(Box)(({ theme }) => ({
  maxWidth: 1400,
  display: "flex",
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: 8,
  paddingRight: 8,
  [theme.breakpoints.down("sm")]: {
    padding: 0,
  },
}));

const HomePage = () => {
  const [userData, setUserData] = useRecoilState(userSelector);
  const { enqueueSnackbar } = useSnackbar();
  const setShowMenu = useSetRecoilState(menuAtom);
  const showAppbar = useRecoilValue(appbarAtom);
  const navigate = useNavigate();
  const token = getCookie("jwt");

  const toggleMenu = () => setShowMenu((state) => !state);

  const getUserData = useCallback(
    async (token: string) => {
      try {
        const result = await getByToken(token);
        const { data, message, code } = result.data;
        if (code === ExpressCodeMap.success && data) {
          setUserData({ ...data, token });
          return;
        }
        enqueueSnackbar(message, {
          variant: "warning",
        });
        navigate("/login", { replace: true });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const { message } = error.response?.data;
          enqueueSnackbar(message, {
            variant: "error",
          });
          setUserData(null);
          navigate("/login");
        }
      }
    },
    [enqueueSnackbar, navigate, setUserData]
  );

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!userData) getUserData(token);
  }, [getUserData, navigate, token, userData]);

  return (
    <ChatSocketProvider>
      <StyledBox className="page-container">
        <Hidden mdUp>
          <AppBar
            position="fixed"
            sx={{
              top: showAppbar ? 0 : "-100%",
            }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                sx={{ color: "white" }}
                onClick={toggleMenu}
              >
                <MenuOpenRoundedIcon color="inherit" />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Hidden>
        <Outlet />
      </StyledBox>
    </ChatSocketProvider>
  );
};

export default HomePage;
