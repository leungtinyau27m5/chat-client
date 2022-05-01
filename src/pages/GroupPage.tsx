import { useEffect, useState } from "react";
import { Box, Drawer, Hidden } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import MainMenu from "src/components/mainMenu";
import MenuBoard from "src/components/mainMenu/MenuBoard";
import UserStatus from "src/components/mainMenu/UserStatus";
import { userSelector } from "src/data/user.atom";
import GroupChatListContainer from "src/components/chatList/GroupChatListContainer";
import { menuAtom } from "src/data/menu.atom";

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
