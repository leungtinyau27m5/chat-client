import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { friendAtom } from "src/data/friend.atom";
import { MySocket, SocketEvents } from "src/shared/chatSocket.proto";

const FriendHandler = (props: FriendHandlerProps) => {
  const { wss } = props;
  const [friendData, setFriendData] = useRecoilState(friendAtom);

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

  useEffect(() => {
    wss.on("friend:list", handleOnList);
    return () => {
      wss.off("friend:list", handleOnList);
    };
  }, [handleOnList, wss]);

  return <></>;
};

export interface FriendHandlerProps {
  wss: MySocket;
}

export default FriendHandler;
