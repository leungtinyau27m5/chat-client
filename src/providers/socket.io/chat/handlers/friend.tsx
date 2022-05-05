import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { friendAtom } from "src/data/friend.atom";
import { MySocket, SocketEvents } from "src/shared/chatSocket.proto";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";

const FriendHandler = (props: FriendHandlerProps) => {
  const { wss } = props;
  const [friendData, setFriendData] = useRecoilState(friendAtom);
  const { enqueueSnackbar } = useSnackbar();

  const handleOnList: SocketEvents.ListenEvents["friend:list"] = useCallback(
    (code, res) => {
      if (res instanceof Error) {
        return;
      }
      const { list, meta } = res;
      if (Object.keys(friendData).length + list.length < meta.total) {
        wss.emit("friend:list", meta.offset + list.length);
      }
      const datas = {} as typeof friendData;
      list.forEach((ele) => {
        datas[ele.user_id] = ele;
      });
      setFriendData((state) => ({
        ...state,
        ...datas,
      }));
    },
    [friendData, setFriendData, wss]
  );

  const handleOnFriendStatus: SocketEvents.ListenEvents["friend:status"] =
    useCallback(
      (res) => {
        const { userId, userHash, status } = res;
        const data = friendData[userId];
        if (data) {
          if (status === "available") {
            enqueueSnackbar(data.marked_name + " has benn " + status, {
              variant: "info",
              autoHideDuration: 3500,
              action: () => (
                <Link to={`/private?hash=${userHash}`}>
                  <IconButton>
                    <CommentIcon fontSize="small" sx={{ color: "white" }} />
                  </IconButton>
                </Link>
              ),
            });
          }
          setFriendData((state) => ({
            ...state,
            [userId]: {
              ...data,
              status,
            },
          }));
          return;
        }
      },
      [enqueueSnackbar, friendData, setFriendData]
    );

  useEffect(() => {
    wss.on("friend:list", handleOnList);
    wss.on("friend:status", handleOnFriendStatus);
    return () => {
      wss.off("friend:list", handleOnList);
      wss.off("friend:status", handleOnFriendStatus);
    };
  }, [handleOnFriendStatus, handleOnList, wss]);

  return <></>;
};

export interface FriendHandlerProps {
  wss: MySocket;
}

export default FriendHandler;
