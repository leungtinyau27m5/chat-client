import { useRecoilValue } from "recoil";
import {
  messageListMetaSelectorByChatId,
  messageListSelectorByChatId,
} from "src/data/messageList.atom";
import MessageItem from "./MessageItem";
import { userSelector } from "src/data/user.atom";
import { useEffect, useLayoutEffect, useRef } from "react";
import { MySocket } from "src/shared/chatSocket.proto";
import { getSession } from "src/utils/storages";

const MessageList = (props: MessageListProps) => {
  const { chatId, wss, bodyEl } = props;
  const messages = useRecoilValue(messageListSelectorByChatId({ chatId }));
  const userData = useRecoilValue(userSelector);
  const listMetaData = useRecoilValue(messageListMetaSelectorByChatId(chatId));
  const itemRefs = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    const items = itemRefs.current;
    return () => {
      if (items[0] && bodyEl.scrollTop < 80) {
        bodyEl.scrollTo({
          top: items[0].offsetTop - 80,
        });
      }
    };
  }, [bodyEl, messages]);

  useEffect(() => {
    console.log(listMetaData);
    if (listMetaData && listMetaData.page === 1) {
      bodyEl.scrollTo({
        top: bodyEl.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [bodyEl, chatId, listMetaData]);

  return (
    <>
      {messages.map((msg, index) => (
        <MessageItem
          key={msg.id}
          data={msg}
          isMe={userData?.id === msg.user_id}
          ref={(el) => el && (itemRefs.current[index] = el)}
        />
      ))}
    </>
  );
};

export interface MessageListProps {
  chatId: number;
  wss: MySocket;
  bodyEl: HTMLDivElement;
}

export default MessageList;
