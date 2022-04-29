import { useCallback, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { chatListAtom } from "src/data/chatList.atom";
import { MySocket, SocketEvents } from "src/shared/chatSocket.proto";

const ChatHandler = (props: ChatHandlerProps) => {
  const { wss } = props;
  const setChatList = useSetRecoilState(chatListAtom);

  const handleMessageUpdate: SocketEvents.ListenEvents["message:update"] =
    useCallback(
      (data) => {
        const { chatId, list } = data;
        setChatList((state) => {
          const newData = { ...state };
          const target = { ...newData[chatId] };
          console.log(target);
          target.msg_id = list[0].id;
          target.user_id = list[0].user_id;
          target.username = list[0].username;
          target.email = list[0].email;
          target.message = list[0].message;
          target.media = list[0].media;
          target.last_msg_time = list[0].created;
          newData[chatId] = target;
          return newData;
        });
      },
      [setChatList]
    );

  useEffect(() => {
    wss.on("message:update", handleMessageUpdate);
    return () => {
      wss.off("message:update", handleMessageUpdate);
    };
  }, [wss, handleMessageUpdate]);

  return <></>;
};

export interface ChatHandlerProps {
  wss: MySocket;
}

export default ChatHandler;
