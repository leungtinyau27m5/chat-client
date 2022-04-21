import { forwardRef, useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { MySocket, SocketEvents } from "src/shared/chatSocket.proto";
import { messageListAtom } from "src/data/messageList.atom";
import { Data } from "src/shared/data.proto";

const MessageHandler = (props: MessageHandlerProps) => {
  const { wss } = props;
  const [messageList, setMessageList] = useRecoilState(messageListAtom);
  const handleMessageUpdate: SocketEvents.ListenEvents["message:update"] =
    useCallback(
      (data) => {
        let newData = {} as { [key: number]: Data.Message[] };
        Object.keys(messageList).forEach((key) => {
          const nKey = Number(key);
          console.log(messageList);
          console.log(nKey);
          newData[nKey] = [...messageList[nKey]];
        });
        data.forEach((ele) => {
          const { list } = ele;
          list.forEach((message) => {
            console.log(message);
            if (newData[message.chat_id]) {
              newData[message.chat_id].push(message);
            } else {
              newData[message.chat_id] = [message];
            }
          });
        });
        console.log(newData);
        setMessageList(newData);
      },
      [messageList, setMessageList]
    );

  useEffect(() => {
    wss.on("message:update", handleMessageUpdate);
    return () => {
      wss.off("message:update", handleMessageUpdate);
    };
  }, [handleMessageUpdate, wss]);

  return <></>;
};

export interface MessageHandlerProps {
  wss: MySocket;
}

export default MessageHandler;
