import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Drawer, Hidden } from "@mui/material";
import { Outlet, useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import MainMenu from "src/components/mainMenu";
import UserStatus from "src/components/mainMenu/UserStatus";
import { userSelector } from "src/data/user.atom";
import MenuBoard from "src/components/mainMenu/MenuBoard";
import FriendChatListContainer from "src/components/chatList/PrivateChatListContainer";
import { menuAtom } from "src/data/menu.atom";
import { chatListMetaAtom } from "src/data/chatList.atom";
import { useChatSocketCtx } from "src/providers/socket.io/chat/context";

const PrivatePage = () => {
  const userData = useRecoilValue(userSelector);
  const { wss, isLogin } = useChatSocketCtx();
  const [showMenu, setShowMenu] = useRecoilState(menuAtom);
  const listMeta = useRecoilValue(chatListMetaAtom);
  const [searchParams, setSearchParams] = useSearchParams();
  const hash = useMemo(() => {
    return searchParams.get("hash");
  }, [searchParams]);
  const onRequest = useRef(false);

  const toggleMenu = () => setShowMenu((state) => !state);

  useEffect(() => {
    if (!hash) return;
    if (!isLogin) return;
    if (onRequest.current) return;
    onRequest.current = true;
    wss.emit("chat:get/private", hash);
  }, [hash, wss, isLogin]);

  useEffect(() => {
    return () => {
      onRequest.current = false;
    };
  }, []);

  useEffect(() => {
    setShowMenu(true);
  }, [setShowMenu]);

  useEffect(() => {
    if (!isLogin) return;
    if (!hash) return;
    if (!listMeta) return;
    if (onRequest.current) return;
    onRequest.current = true;
    wss.emit("chat:get/private", hash);
  }, [hash, isLogin, listMeta, wss]);

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
                {listMeta && <FriendChatListContainer />}
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
                  {listMeta && <FriendChatListContainer />}
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

export default PrivatePage;
