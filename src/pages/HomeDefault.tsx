import { Box, Hidden, IconButton, styled } from "@mui/material";
import { menuAtom } from "src/data/menu.atom";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainMenu from "src/components/mainMenu";
import MenuBoard from "src/components/mainMenu/MenuBoard";
import UserStatus from "src/components/mainMenu/UserStatus";
import { userSelector } from "src/data/user.atom";

const StyledBox = styled(Box)(() => ({
  width: "100%",
}));

const HomeDefault = () => {
  const setShowMenu = useSetRecoilState(menuAtom);
  const userData = useRecoilValue(userSelector);
  return (
    <StyledBox>
      {userData && (
        <MainMenu>
          <MenuBoard>
            <Box className="header">
              <UserStatus userData={userData} />
            </Box>
            <Box className="body"></Box>
          </MenuBoard>
        </MainMenu>
      )}
    </StyledBox>
  );
};

export default HomeDefault;
