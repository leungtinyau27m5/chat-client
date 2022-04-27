import { Box, List, styled, Typography, ListItem, Button } from "@mui/material";
import { useRecoilValue } from "recoil";
import { chatListSelectorByType } from "src/data/chatList.atom";
import { StyledTextField } from "../styled/MyTextField";
import ChatItem from "./ChatItem";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CreateGroupChat from "../dialogs/CreateGroupChat";

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  width: "100%",
  "& .search": {
    width: "100%",
  },
  "& .list-head": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: `${theme.spacing(1.2)} ${theme.spacing(0.5)}`,
    "& .btn-add": {
      minWidth: 0,
      padding: theme.spacing(0.5),
      borderRadius: 8,
    },
  },
}));

const GroupChatList = () => {
  const list = useRecoilValue(chatListSelectorByType("group"));
  const [openCreateChat, setOpenCreateChat] = useState(false);
  const [keyword, setKeyword] = useState("");
  const filteredList = useMemo(() => {
    return list.filter((ele) => ele.name.match(keyword));
  }, [keyword, list]);
  const { id } = useParams();

  const toggleCreateChat = (open?: boolean) => {
    if (open === undefined) setOpenCreateChat((state) => !state);
    else setOpenCreateChat(open);
  };

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
      <Box className="list-head">
        <Typography variant="subtitle2">Group</Typography>
        <Button className="btn-add" onClick={() => toggleCreateChat(true)}>
          <AddRoundedIcon />
        </Button>
      </Box>
      <List>
        {filteredList.map((ele) => (
          <ChatItem key={ele.id} data={ele} isActive={Number(id) === ele.id} />
        ))}
        {filteredList.length === 0 && (
          <ListItem sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h6" align="center">
              {keyword !== "" ? "No Search Result ..." : "No More Items ..."}
            </Typography>
          </ListItem>
        )}
      </List>
      <CreateGroupChat open={openCreateChat} toggle={toggleCreateChat} />
    </StyledBox>
  );
};

export default GroupChatList;
