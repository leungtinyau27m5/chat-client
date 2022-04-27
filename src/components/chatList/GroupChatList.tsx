import { Box, List, styled, Typography, ListItem, Button } from "@mui/material";
import { useRecoilValue } from "recoil";
import { chatListSelectorByType } from "src/data/chatList.atom";
import { StyledTextField } from "../styled/MyTextField";
import ChatItem from "./ChatItem";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CreateGroupChat from "../dialogs/CreateGroupChat";
import { ChatSocketContext } from "src/providers/socket.io/chat/context";

const StyledBox = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  overflow: "auto",
  "& .search": {
    width: "100%",
  },
  "& .list-head": {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    rowGap: 12,
    padding: `${theme.spacing(1.2)} ${theme.spacing(1.75)}`,
    position: "sticky",
    top: 0,
    transition: "all .3s ease-in-out",
    backgroundColor: "rgba(255, 255, 255, 1)",
    zIndex: 1,
    "& .btn-add": {
      minWidth: 0,
      padding: theme.spacing(0.5),
      borderRadius: 8,
    },
  },
  "&.on-scrolled": {
    "& .list-head": {
      boxShadow: "0px 2px 5px -1px rgba(15, 15, 15, 0.15)",
      borderRadius: 15,
    },
  },
}));

const GroupChatList = () => {
  const list = useRecoilValue(chatListSelectorByType("group"));
  const [searchParams, setSearchParams] = useSearchParams();
  const [openCreateChat, setOpenCreateChat] = useState(false);
  const [keyword, setKeyword] = useState("");
  const filteredList = useMemo(() => {
    return list.filter((ele) => ele.name.match(keyword));
  }, [keyword, list]);
  const containerRef = useRef<HTMLDivElement>(null);
  const chatId = useMemo(() => {
    return searchParams.get("id") || undefined;
  }, [searchParams]);

  const toggleCreateChat = (open?: boolean) => {
    if (open === undefined) setOpenCreateChat((state) => !state);
    else setOpenCreateChat(open);
  };

  const handleOnClick = (id: number) => {
    const updatedParams = new URLSearchParams(searchParams.toString());
    updatedParams.set("id", id.toString());
    setSearchParams(updatedParams);
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const handleOnScroll = (evt: Event) => {
      const target = evt.target as HTMLElement;
      if (target.scrollTop > 50) {
        target.classList.add("on-scrolled");
      } else {
        target.classList.remove("on-scrolled");
      }
    };
    container.addEventListener("scroll", handleOnScroll);
    return () => {
      container.removeEventListener("scroll", handleOnScroll);
    };
  }, []);

  return (
    <StyledBox className="group-chat-list min-scrollbar" ref={containerRef}>
      <Box className="list-head">
        <StyledTextField
          variant="filled"
          className="search"
          placeholder="Search"
          value={keyword}
          onChange={(evt) => setKeyword(evt.target.value as string)}
          InputProps={{
            disableUnderline: true,
            endAdornment: <SearchRoundedIcon sx={{ color: "darkgrey" }} />,
          }}
        />
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="subtitle2">Group</Typography>
          <Button className="btn-add" onClick={() => toggleCreateChat(true)}>
            <AddRoundedIcon />
          </Button>
        </Box>
      </Box>
      <List sx={{ p: 1 }}>
        {filteredList.map((ele) => (
          <ChatItem
            key={ele.id}
            data={ele}
            isActive={Number(chatId) === ele.id}
            handleOnClick={handleOnClick}
          />
        ))}
        {filteredList.length === 0 && (
          <ListItem sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h6" align="center">
              {keyword !== "" ? "No Search Result ..." : "No More Items ..."}
            </Typography>
          </ListItem>
        )}
      </List>
      <ChatSocketContext.Consumer>
        {({ isLogin }) =>
          isLogin && (
            <CreateGroupChat open={openCreateChat} toggle={toggleCreateChat} />
          )
        }
      </ChatSocketContext.Consumer>
    </StyledBox>
  );
};

export default GroupChatList;
