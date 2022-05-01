import { useState } from "react";
import { Box, Drawer, Hidden } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import MainMenu from "src/components/mainMenu";
import MenuBoard from "src/components/mainMenu/MenuBoard";
import UserStatus from "src/components/mainMenu/UserStatus";
import { userSelector } from "src/data/user.atom";
import GroupChatListContainer from "src/components/chatList/GroupChatListContainer";

const GroupPage = () => {
  const userData = useRecoilValue(userSelector);
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu((state) => !state);

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
          <Drawer anchor="left" open={showMenu} onClick={toggleMenu}>
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
        <Outlet />
      </>
    )
  );
};

export default GroupPage;
