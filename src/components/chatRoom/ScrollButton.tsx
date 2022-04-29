import { useLayoutEffect, useState } from "react";
import {
  Badge,
  Box,
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
  const { chatId, bodyEl } = props;
  const unread = useRecoilValue(chatUnreadSelectorById(chatId));
  const [scrollHeightFit, setScrollHeightFit] = useState(false);
  console.count("scroll button");
  const scrollToButtom = () => {
    bodyEl.scrollTo({
      top: bodyEl.scrollHeight,
      behavior: "smooth",
    });
  };

  useLayoutEffect(() => {
    const handleScroll = () => {
      setScrollHeightFit(bodyEl.scrollHeight - 610 * 2 >= bodyEl.scrollTop);
    };
    bodyEl.addEventListener("scroll", handleScroll);
    return () => {
      bodyEl.removeEventListener("scroll", handleScroll);
    };
  }, [bodyEl]);

  return (
    <StyledBox
      className={clsx("scroll-button-container", { active: scrollHeightFit })}
    >
      <Badge
        badgeContent={unread.length}
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
