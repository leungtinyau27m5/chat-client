import { useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { Typography, Button } from "@mui/material";
import { chatListSelectorByType } from "src/data/chatList.atom";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useSearchParams } from "react-router-dom";
import CreateGroupChat from "../dialogs/CreateGroupChat";
import { ChatSocketContext } from "src/providers/socket.io/chat/context";
import ChatList from ".";

const GroupChatListContainer = () => {
  const rawList = useRecoilValue(chatListSelectorByType("group"));
  const [searchParams, setSearchParams] = useSearchParams();
  const [openCreateChat, setOpenCreateChat] = useState(false);
  const hash = useMemo(() => {
    return searchParams.get("hash");
  }, [searchParams]);

  const toggleCreateChat = (open?: boolean) => {
    if (open === undefined) setOpenCreateChat((state) => !state);
    else setOpenCreateChat(open);
  };

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
          <Typography variant="subtitle2">Group</Typography>
          <Button className="btn-add" onClick={() => toggleCreateChat(true)}>
            <AddRoundedIcon />
          </Button>
        </>
      }
      itemOnClick={handleOnClick}
    >
      <ChatSocketContext.Consumer>
        {({ isLogin }) =>
          isLogin && (
            <CreateGroupChat open={openCreateChat} toggle={toggleCreateChat} />
          )
        }
      </ChatSocketContext.Consumer>
    </ChatList>
  );
};

export default GroupChatListContainer;
