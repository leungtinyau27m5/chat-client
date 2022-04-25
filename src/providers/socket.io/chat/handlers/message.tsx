import { forwardRef, useCallback, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  MySocket,
  SocketCodeMap,
  SocketEvents,
} from "src/shared/chatSocket.proto";
import {
  messageListAtom,
  messageListMetaAtom,
} from "src/data/messageList.atom";
import { Data } from "src/shared/data.proto";

const MessageHandler = (props: MessageHandlerProps) => {
  const { wss } = props;
  const [messageList, setMessageList] = useRecoilState(messageListAtom);
  const setMessageListMeta = useSetRecoilState(messageListMetaAtom);

  const handleMessageUpdate: SocketEvents.ListenEvents["message:update"] =
    useCallback(
      (data) => {
        const { chatId, list } = data;
        const target = messageList[chatId] ? [...messageList[chatId]] : [];
        let count = {} as { [key: number]: number };
        list.forEach((message) => {
          target.push(message);
          if (count[message.chat_id]) {
            count[message.chat_id] += 1;
          } else {
            count[message.chat_id] = 0;
          }
        });
        setMessageList((state) => {
          return {
            ...state,
            [chatId]: target,
          };
        });
      },
      [messageList, setMessageList]
    );

  const handleMessageList: SocketEvents.ListenEvents["message:list"] =
    useCallback(
      (code, res) => {
        if (code !== SocketCodeMap.success || !res) return;
        if (res instanceof Error) return;
        const { list, chatId, meta } = res;

        let newList = messageList[chatId] ? [...messageList[chatId]] : [];
        const startIdx = newList.length - meta.offset;
        newList.splice(startIdx, 0, ...list);
        const ids = [] as number[];
        const unique = newList.reduce((arr, ele) => {
          if (!ids.includes(ele.id)) {
            arr.push(ele);
            ids.push(ele.id);
          }
          return arr;
        }, [] as typeof newList);
        setMessageList((state) => ({
          ...state,
          [chatId]: unique,
        }));
        setMessageListMeta((state) => {
          const newMetaData = { ...state };
          console.log(unique)
          newMetaData[chatId] = {
            offset: meta.offset,
            total: meta.total,
            page: Math.ceil(unique.length / 20),
          };

          return newMetaData;
        });
      },
      [messageList, setMessageList, setMessageListMeta]
    );

  useEffect(() => {
    wss.on("message:update", handleMessageUpdate);
    return () => {
      wss.off("message:update", handleMessageUpdate);
    };
  }, [handleMessageUpdate, wss]);

  useEffect(() => {
    wss.on("message:list", handleMessageList);
    return () => {
      wss.off("message:list", handleMessageList);
    };
  }, [handleMessageList, wss]);

  return <></>;
};

export interface MessageHandlerProps {
  wss: MySocket;
}

export default MessageHandler;
