import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { messageListSelectorByChatId } from "src/data/messageList.atom";
import MessageItem from "./MessageItem";
import { userSelector } from "src/data/user.atom";
import {
  MySocket,
  SocketCodeMap,
  SocketEvents,
} from "src/shared/chatSocket.proto";
import { Box, IconButton, Toolbar } from "@mui/material";
import { getMsgDate } from "src/helpers/chatHelper";
import { chatUnreadSelectorById } from "src/data/chatList.atom";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { useSnackbar } from "notistack";

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
  const { chatId, wss, bodyEl } = props;
  const { enqueueSnackbar } = useSnackbar();
  const messages = useRecoilValue(messageListSelectorByChatId({ chatId }));
  const userData = useRecoilValue(userSelector);
  const [unreadIds, setUnreadIds] = useRecoilState(
    chatUnreadSelectorById(chatId)
  );
  const itemRefs = useRef<{ [key: number]: HTMLDivElement }>({});
  const dateMark = useRef<HTMLDivElement>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const onSelectMode = selectedItems.length !== 0;
  const lastSelected = useRef<number[]>([]);
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

  const handleItemSelection = (id: number) => {
    const arr = [...selectedItems];
    const idx = arr.findIndex((ele) => ele === id);
    if (idx === -1) {
      arr.push(id);
    } else {
      arr.splice(idx, 1);
    }
    setSelectedItems(arr);
  };

  const handleMultipleDelete = () => {
    lastSelected.current = selectedItems;
    wss.emit("message:delete", chatId, selectedItems);
    resetSelect();
  };

  const resetSelect = () => {
    setSelectedItems([]);
  };

  const handleOnMessgeDeleteResponse: SocketEvents.ListenEvents["message:delete"] =
    useCallback(
      (code, res) => {
        if (res instanceof Error) {
          enqueueSnackbar(res.message, {
            variant: "warning",
          });
          return;
        }
        const failedIds = lastSelected.current.filter(
          (ele) => !res.includes(ele)
        );
        if (failedIds.length) {
          enqueueSnackbar("Some action is not completed", {
            variant: "warning",
          });
        }
        lastSelected.current = [];
      },
      [enqueueSnackbar]
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

  useEffect(() => {
    wss.on("message:delete", handleOnMessgeDeleteResponse);
    return () => {
      wss.off("message:delete", handleOnMessgeDeleteResponse);
    };
  }, [handleOnMessgeDeleteResponse, wss]);

  return (
    <>
      {Object.keys(arrangedMessages).map((key) => (
        <ItemContainer key={key} date={key}>
          {arrangedMessages[key].map((ele) => (
            <MessageItem
              key={ele.id}
              data={ele}
              isSelected={selectedItems.includes(ele.id)}
              handleItemSelection={handleItemSelection}
              isMe={userData?.id === ele.user_id}
              onSelectMode={onSelectMode}
              ref={(el) => el && (itemRefs.current[ele.id] = el)}
            />
          ))}
        </ItemContainer>
      ))}
      <Box className="fixed-top-container">
        {onSelectMode && (
          <Box className="select-summary">
            <Box className="">
              <IconButton onClick={resetSelect}>
                <CloseRoundedIcon />
              </IconButton>
              <Box className="">{selectedItems.length} selected</Box>
            </Box>
            <Box className="">
              <IconButton onClick={handleMultipleDelete}>
                <DeleteForeverRoundedIcon color="error" />
              </IconButton>
            </Box>
          </Box>
        )}
        <Box className="current-date-mark" ref={dateMark}></Box>
      </Box>
    </>
  );
};

export interface MessageListProps {
  chatId: number;
  wss: MySocket;
  bodyEl: HTMLDivElement;
}

export default MessageList;
