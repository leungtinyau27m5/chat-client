import { useEffect, useMemo, useRef } from "react";
import { Typography, Button } from "@mui/material";
import { useRecoilValue } from "recoil";
import {
  chatHashToIdSelector,
  chatListSelectorByType,
  chatSelectorByHash,
} from "src/data/chatList.atom";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useSearchParams } from "react-router-dom";
import ChatList from ".";
import { useChatSocketCtx } from "src/providers/socket.io/chat/context";

const FriendChatListContainer = () => {
  const { wss, isLogin } = useChatSocketCtx();
  const rawList = useRecoilValue(chatListSelectorByType("private"));
  const [searchParams, setSearchParams] = useSearchParams();
  const hash = useMemo(() => {
    return searchParams.get("hash");
  }, [searchParams]);
  const target = useRecoilValue(chatSelectorByHash(hash));
  const onRequest = useRef(false);

  const handleOnClick = (newHash: string) => {
    const updatedParams = new URLSearchParams(searchParams.toString());
    updatedParams.set("hash", newHash);
    setSearchParams(updatedParams);
  };

  return (
    <ChatList
      list={rawList}
      hash={hash}
      head={
        <>
          <Typography variant="subtitle2">Private</Typography>
          <Button className="btn-add">
            <AddRoundedIcon />
          </Button>
        </>
      }
      itemOnClick={handleOnClick}
    ></ChatList>
  );
};

export default FriendChatListContainer;
