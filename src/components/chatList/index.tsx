import { ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Data } from "src/shared/data.proto";
import { Box, List, styled, Typography, ListItem } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { StyledTextField } from "../styled/MyTextField";
import ChatItem from "./ChatItem";

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

const ChatList = (props: ChatListProps) => {
  const { list, children, head, itemOnClick, hash } = props;
  const [keyword, setKeyword] = useState("");
  const filteredList = useMemo(() => {
    return list
      .filter((ele) =>
        ele.name.toLocaleLowerCase().match(keyword.toLowerCase())
      )
      .sort(
        (a, b) =>
          new Date(b.last_msg_time || b.created).getTime() -
          new Date(a.last_msg_time || a.created).getTime()
      );
  }, [keyword, list]);
  const containerRef = useRef<HTMLDivElement>(null);

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
          {head}
        </Box>
      </Box>
      <List sx={{ p: 1 }}>
        {filteredList.map((ele) => (
          <ChatItem
            key={ele.id}
            data={ele}
            isActive={hash === ele.hash}
            handleOnClick={itemOnClick}
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
      {children}
    </StyledBox>
  );
};

export interface ChatListProps {
  hash: string | null;
  list: Data.Chat[];
  head: ReactNode;
  itemOnClick: (hash: string) => void;
  children?: ReactNode;
}

export default ChatList;
