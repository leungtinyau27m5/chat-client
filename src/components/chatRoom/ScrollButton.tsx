import { useEffect, useLayoutEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  ButtonBase,
  buttonBaseClasses,
  styled,
} from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { MySocket } from "src/shared/chatSocket.proto";
import clsx from "clsx";
import { useRecoilValue } from "recoil";
import { chatUnreadSelectorById } from "src/data/chatList.atom";

const StyledBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 80,
  right: 24,
  borderRadius: "50%",
  minWidth: 0,
  minHeight: 0,
  opacity: 0,
  visibility: "hidden",
  transition: "all .3s ease-in-out",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "&.active": {
    visibility: "visible",
    opacity: 0.85,
  },
  [`& .${buttonBaseClasses.root}`]: {
    width: 40,
    height: 40,
    backgroundColor: theme.palette.secondary.main,
    color: "white",
    borderRadius: "50%",
  },
}));

const ScrollButton = (props: ScrollButtonProps) => {
  const { chatId, wss, bodyEl } = props;
  const unread = useRecoilValue(chatUnreadSelectorById(chatId));
  const [active, setActive] = useState(true);

  const scrollToButtom = () => {
    bodyEl.scrollTo({
      top: bodyEl.scrollHeight,
      behavior: "smooth",
    });
  };

  // useLayoutEffect(() => {
  //   const handleScroll = () => {
  //     setActive(bodyEl.scrollHeight - bodyEl.scrollTop > 1500 || unread !== 0);
  //   };
  //   setActive(unread !== 0);
  //   bodyEl.addEventListener("scroll", handleScroll);
  //   return () => {
  //     bodyEl.removeEventListener("scroll", handleScroll);
  //   };
  // }, [bodyEl, unread]);

  return (
    <StyledBox className={clsx("scroll-button-container", { active })}>
      <Badge
        badgeContent={unread}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        color="primary"
      >
        <ButtonBase onClick={scrollToButtom}>
          <KeyboardArrowDownRoundedIcon />
        </ButtonBase>
      </Badge>
    </StyledBox>
  );
};

export interface ScrollButtonProps {
  chatId: number;
  wss: MySocket;
  bodyEl: HTMLDivElement;
}

export default ScrollButton;
