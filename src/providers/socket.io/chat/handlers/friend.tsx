import { MySocket, SocketEvents } from "src/shared/chatSocket.proto";

const FriendHandler = (props: FriendHandlerProps) => {
  const { wss } = props;

  const handleOnList = () => {};

  return <></>;
};

export interface FriendHandlerProps {
  wss: MySocket;
}

export default FriendHandler;
