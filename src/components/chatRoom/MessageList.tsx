import { useRecoilState, useRecoilValue } from "recoil";
import { messageListSelectorByChatId } from "src/data/messageList.atom";
import { Box } from "@mui/material";
import MessageItem from "./MessageItem";
import { userSelector } from "src/data/user.atom";

const MessageList = (props: MessageListProps) => {
  const { chatId } = props;
  const [messages, setMessages] = useRecoilState(
    messageListSelectorByChatId({
      chatId,
    })
  );
  const userData = useRecoilValue(userSelector);
  return (
    <Box>
      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
          data={msg}
          isMe={userData?.id === msg.user_id}
        />
      ))}
    </Box>
  );
};

export interface MessageListProps {
  chatId: number;
}

export default MessageList;
