import { Box, List, styled, Typography, ListItem } from "@mui/material";
import { useRecoilValue } from "recoil";
import { chatListSelectorByType } from "src/data/chatList.atom";
import { StyledTextField } from "../styled/MyTextField";
import ChatItem from "./ChatItem";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useMemo, useState } from "react";

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  "& .search": {
    width: "100%",
  },
}));

const GroupChatList = () => {
  const list = useRecoilValue(chatListSelectorByType("group"));
  const [keyword, setKeyword] = useState("");
  const filteredList = useMemo(() => {
    return list.filter((ele) => ele.name.match(keyword));
  }, [keyword, list]);

  return (
    <StyledBox>
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
      <List>
        {filteredList.map((ele) => (
          <ChatItem key={ele.id} data={ele} />
        ))}
        {filteredList.length === 0 && (
          <ListItem sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h6" align="center">
              {keyword !== "" ? "No Search Result ..." : "No More Items ..."}
            </Typography>
          </ListItem>
        )}
      </List>
    </StyledBox>
  );
};

export default GroupChatList;
