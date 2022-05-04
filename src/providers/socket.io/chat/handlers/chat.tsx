import { useSnackbar } from "notistack";
import { useCallback, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { chatListAtom } from "src/data/chatList.atom";
import { MySocket, SocketEvents } from "src/shared/chatSocket.proto";

const ChatHandler = (props: ChatHandlerProps) => {
  const { wss } = props;
  const setChatList = useSetRecoilState(chatListAtom);
  const { enqueueSnackbar } = useSnackbar();

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

  const handleOnCreate: SocketEvents.ListenEvents["chat:create"] = useCallback(
    (code, res) => {
      if (res instanceof Error) {
        enqueueSnackbar("create group fail: " + res.message, {
          variant: "error",
        });
        return;
      }
      enqueueSnackbar("Group Created! " + res[0].name, {
        variant: "success",
      });
    },
    [enqueueSnackbar]
  );

  const handleOnInvite: SocketEvents.ListenEvents["chat:invite"] = useCallback(
    (chatId) => {
      enqueueSnackbar("You have been invited to join a group", {
        variant: "info",
      });
      wss.emit("chat:get", chatId);
    },
    [wss, enqueueSnackbar]
  );

  const handleOnChatGet: SocketEvents.ListenEvents["chat:get"] = useCallback(
    (code, res) => {
      if (res instanceof Error) {
        enqueueSnackbar("Get Group Info failed", {
          variant: "error",
        });
        return;
      }
      const [arr0] = res;
      setChatList((state) => ({
        [arr0.id]: arr0,
        ...state,
      }));
    },
    [setChatList, enqueueSnackbar]
  );

  useEffect(() => {
    wss.on("message:update", handleMessageUpdate);
    wss.on("chat:create", handleOnCreate);
    wss.on("chat:invite", handleOnInvite);
    wss.on("chat:get", handleOnChatGet);
    return () => {
      wss.off("message:update", handleMessageUpdate);
      wss.off("chat:create", handleOnCreate);
      wss.off("chat:invite", handleOnInvite);
      wss.off("chat:get", handleOnChatGet);
    };
  }, [
    wss,
    handleMessageUpdate,
    handleOnCreate,
    handleOnInvite,
    handleOnChatGet,
  ]);

  return <></>;
};

export interface ChatHandlerProps {
  wss: MySocket;
}

export default ChatHandler;
