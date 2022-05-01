import { useSnackbar } from "notistack";
import { useCallback, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { userSelector } from "src/data/user.atom";
import {
  MySocket,
  SocketCodeMap,
  SocketEvents,
} from "src/shared/chatSocket.proto";

const UserHandler = (props: UserHandlerProps) => {
  const { wss } = props;
  const setUserData = useSetRecoilState(userSelector);
  const { enqueueSnackbar } = useSnackbar();

  const handleOnStatusChange: SocketEvents.ListenEvents["user:status"] =
    useCallback(
      (code, res) => {
        if (code !== SocketCodeMap.success) {
          enqueueSnackbar("Status update Fail", {
            variant: "warning",
          });
        }
        if (res === undefined) return;
        if (res instanceof Error) {
          enqueueSnackbar(res.message, {
            variant: "warning",
          });
          return;
        }
        setUserData((state) => {
          if (state === null) return state;
          return {
            ...state,
            status: res,
          };
        });
      },
      [enqueueSnackbar, setUserData]
    );

  useEffect(() => {
    wss.on("user:status", handleOnStatusChange);
    return () => {
      wss.off("user:status", handleOnStatusChange);
    };
  }, [wss, handleOnStatusChange]);

  return <></>;
};

export interface UserHandlerProps {
  wss: MySocket;
}

export default UserHandler;
