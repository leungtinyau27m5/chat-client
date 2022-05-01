import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  MySocket,
  SocketCodeMap,
  SocketEvents,
} from "src/shared/chatSocket.proto";
import {
  messageListAtom,
  messageListMetaAtom,
} from "src/data/messageList.atom";
import { chatUnreadAtom } from "src/data/chatList.atom";
import { userSelector } from "src/data/user.atom";

const MessageHandler = (props: MessageHandlerProps) => {
  const { wss } = props;
  const [messageList, setMessageList] = useRecoilState(messageListAtom);
  const userData = useRecoilValue(userSelector);
  const setMessageListMeta = useSetRecoilState(messageListMetaAtom);
  const setChatUnread = useSetRecoilState(chatUnreadAtom);

  const handleMessageUpdate: SocketEvents.ListenEvents["message:update"] =
    useCallback(
      (data) => {
        const { chatId, list } = data;
        const target = messageList[chatId] ? [...messageList[chatId]] : [];
        let count = {} as { [key: number]: number[] };
        list.forEach((message) => {
          target.push(message);
          if (count[message.chat_id] && message.sender_id !== userData?.id) {
            count[message.chat_id].push(message.id);
          } else if (!count[message.chat_id]) {
            count[message.chat_id] = [message.id];
          }
        });
        setMessageList((state) => {
          return {
            ...state,
            [chatId]: target,
          };
        });
        setChatUnread((state) => {
          const newData = { ...state };
          Object.keys(count).forEach((key) => {
            const nKey = Number(key);
            if (newData[nKey])
              newData[nKey] = [...newData[nKey], ...count[nKey]];
            else newData[nKey] = count[nKey];
          });
          return newData;
        });
      },
      [messageList, setChatUnread, setMessageList, userData?.id]
    );

  const handleMessageModified: SocketEvents.ListenEvents["message:modified"] =
    useCallback(
      (chatId, data) => {
        const temp = { ...messageList };
        const target = temp[chatId] ? [...temp[chatId]] : [];
        data.forEach((ele) => {
          switch (ele.actions) {
            case "delete": {
              const idx = target.findIndex((msg) => msg.id === ele.id);
              console.log(idx);
              if (idx !== -1) target.splice(idx, 1);
              break;
            }
            case "edit": {
              if (ele.message) target[ele.id].message = ele.message;
              break;
            }
            default: {
            }
          }
        });
        setMessageList((state) => ({
          ...state,
          [chatId]: target,
        }));
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

  useEffect(() => {
    wss.on("message:modified", handleMessageModified);
    return () => {
      wss.off("message:modified", handleMessageModified);
    };
  }, [handleMessageModified]);

  return <></>;
};

export interface MessageHandlerProps {
  wss: MySocket;
}

export default MessageHandler;
