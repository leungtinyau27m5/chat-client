import axios from "axios";
import { useSnackbar } from "notistack";
import { useCallback, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { getByToken } from "src/api/chat";
import { ExpressCodeMap } from "src/api/express.proto";
import MainMenu from "src/components/mainMenu";
import { userSelector } from "src/data/user.atom";
import { getCookie } from "src/utils/storages";

const HomePage = () => {
  const [userData, setUserData] = useRecoilState(userSelector);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const token = getCookie("jwt");

  const getUserData = useCallback(
    async (token: string) => {
      try {
        const result = await getByToken(token);
        const { data, message, code } = result.data;
        if (code === ExpressCodeMap.success && data) {
          setUserData(data);
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
    getUserData(token);
  }, [getUserData, navigate, token]);

  return (
    <>
      <MainMenu />
      <Outlet />
    </>
  );
};

export default HomePage;
