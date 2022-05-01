import { Box, Drawer, Hidden, styled } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useCallback, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { getByToken } from "src/api/chat";
import { ExpressCodeMap } from "src/api/express.proto";
import MainMenu from "src/components/mainMenu";
import { menuAtom } from "src/data/menu.atom";
import { userSelector } from "src/data/user.atom";
import ChatSocketProvider from "src/providers/socket.io/chat";
import { getCookie } from "src/utils/storages";

const StyledBox = styled(Box)(() => ({
  maxWidth: 1200,
  display: "flex",
  marginLeft: "auto",
  marginRight: "auto",
}));

const HomePage = () => {
  const [userData, setUserData] = useRecoilState(userSelector);
  const { enqueueSnackbar } = useSnackbar();
  const [showMenu, setShowMenu] = useRecoilState(menuAtom);
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
        }
        console.log(error);
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
        {/* <Hidden mdDown>
          <MainMenu />
        </Hidden>
        <Hidden mdUp>
          <Drawer anchor="left" open={showMenu} onClose={() => toggleMenu()}>
            <MainMenu />
          </Drawer>
        </Hidden> */}
        <Outlet />
      </StyledBox>
    </ChatSocketProvider>
  );
};

export default HomePage;
