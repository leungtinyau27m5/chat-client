import { useEffect } from "react";
import { Box, Drawer, Hidden } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import MainMenu from "src/components/mainMenu";
import MenuBoard from "src/components/mainMenu/MenuBoard";

import { userSelector } from "src/data/user.atom";
import { menuAtom } from "src/data/menu.atom";
import loadable from "@loadable/component";
import ChatRoom from "src/components/chatRoom";

const UserStatus = loadable(() => import("src/components/mainMenu/UserStatus"));
const GroupChatListContainer = loadable(
  () => import("src/components/chatList/GroupChatListContainer")
);

const GroupPage = () => {
  const userData = useRecoilValue(userSelector);
  const [showMenu, setShowMenu] = useRecoilState(menuAtom);

  const toggleMenu = () => setShowMenu((state) => !state);

  useEffect(() => {
    setShowMenu(true);
  }, [setShowMenu]);

  return (
    userData && (
      <>
        <Hidden mdDown>
          <MainMenu>
            <MenuBoard>
              <Box className="header">
                <UserStatus userData={userData} />
              </Box>
              <Box className="body">
                <GroupChatListContainer />
              </Box>
            </MenuBoard>
          </MainMenu>
        </Hidden>
        <Hidden mdUp>
          <Drawer anchor="left" open={showMenu} onClose={toggleMenu}>
            <MainMenu>
              <MenuBoard>
                <Box className="header">
                  <UserStatus userData={userData} />
                </Box>
                <Box className="body">
                  <GroupChatListContainer />
                </Box>
              </MenuBoard>
            </MainMenu>
          </Drawer>
        </Hidden>
        <ChatRoom />
      </>
    )
  );
};

export default GroupPage;
