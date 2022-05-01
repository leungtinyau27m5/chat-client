import { useMemo } from "react";
import { Typography, Button } from "@mui/material";
import { useRecoilValue } from "recoil";
import { chatListSelectorByType } from "src/data/chatList.atom";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useSearchParams } from "react-router-dom";
import ChatList from ".";

const FriendChatListContainer = () => {
  const rawList = useRecoilValue(chatListSelectorByType("private"));
  const [searchParams, setSearchParams] = useSearchParams();
  const chatId = useMemo(() => {
    return searchParams.get("id");
  }, [searchParams]);

  const handleOnClick = (id: number) => {
    const updatedParams = new URLSearchParams(searchParams.toString());
    updatedParams.set("id", id.toString());
    setSearchParams(updatedParams);
  };

  return (
    <ChatList
      list={rawList}
      chatId={chatId}
      head={
        <>
          <Typography variant="subtitle2">Group</Typography>
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
