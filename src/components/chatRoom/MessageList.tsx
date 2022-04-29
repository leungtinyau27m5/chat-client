import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  ReactNode,
} from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { messageListSelectorByChatId } from "src/data/messageList.atom";
import MessageItem from "./MessageItem";
import { userSelector } from "src/data/user.atom";
import { MySocket } from "src/shared/chatSocket.proto";
import { Box } from "@mui/material";
import { getMsgDate } from "src/helpers/chatHelper";
import { chatUnreadSelectorById } from "src/data/chatList.atom";

const ItemContainer = (props: { date: string; children: ReactNode }) => {
  const { date, children } = props;
  return (
    <>
      <Box className="date-marks">{date}</Box>
      {children}
    </>
  );
};

const MessageList = (props: MessageListProps) => {
  const { chatId, bodyEl } = props;
  const messages = useRecoilValue(messageListSelectorByChatId({ chatId }));
  const userData = useRecoilValue(userSelector);
  const [unreadIds, setUnreadIds] = useRecoilState(
    chatUnreadSelectorById(chatId)
  );
  const itemRefs = useRef<{ [key: number]: HTMLDivElement }>({});
  const dateMark = useRef<HTMLDivElement>(null);
  const arrangedMessages = useMemo(() => {
    const list = {} as { [key: string]: typeof messages };
    messages.forEach((ele) => {
      const date = getMsgDate(ele.created);
      if (!(date.date in list)) {
        list[date.date] = [];
      }
      list[date.date].push(ele);
    });
    return list;
  }, [messages]);

  const handleCallback: IntersectionObserverCallback = useCallback(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const { date, id } = (entry.target as HTMLElement).dataset;
          const target = dateMark.current;
          if (target && date) {
            target.innerText = date;
            target.style.padding = "8px";
          }
          if (id) {
            const idx = unreadIds.findIndex((ele) => ele === Number(id));
            if (idx === -1) return;
            setUnreadIds((state) => {
              const newArr = [...state];
              newArr.splice(idx, 1);
              console.log(newArr);
              return newArr;
            });
          }
        }
      });
    },
    [unreadIds, setUnreadIds]
  );

  useLayoutEffect(() => {
    const items = { ...itemRefs.current };
    const firstKey = Number(Object.keys(items)[0]);
    return () => {
      const first = items[firstKey];
      if (first && bodyEl.scrollTop < 80) {
        bodyEl.scrollTo({
          top: first.offsetTop - 80,
        });
      }
    };
  }, [bodyEl, arrangedMessages]);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(handleCallback);
    const items = itemRefs.current;
    const target = dateMark.current;
    Object.values(items).forEach((ele) => {
      observer.observe(ele);
    });
    return () => {
      observer.disconnect();
      if (target) {
        target.style.padding = "0px";
        target.innerText = "";
      }
    };
  }, [handleCallback, arrangedMessages]);

  return (
    <>
      {Object.keys(arrangedMessages).map((key) => (
        <ItemContainer key={key} date={key}>
          {arrangedMessages[key].map((ele) => (
            <MessageItem
              key={ele.id}
              data={ele}
              isMe={userData?.id === ele.user_id}
              ref={(el) => el && (itemRefs.current[ele.id] = el)}
            />
          ))}
        </ItemContainer>
      ))}
      <Box className="current-date-mark" ref={dateMark}></Box>
    </>
  );
};

export interface MessageListProps {
  chatId: number;
  wss: MySocket;
  bodyEl: HTMLDivElement;
}

export default MessageList;
