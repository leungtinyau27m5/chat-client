import { useEffect, useLayoutEffect, useState } from "react";
import { Badge, Button, styled } from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { MySocket } from "src/shared/chatSocket.proto";
import clsx from "clsx";

const StyledButton = styled(Button)(() => ({
  position: "fixed",
  bottom: 100,
  right: 36,
  borderRadius: "50%",
  width: 40,
  height: 40,
  minWidth: 0,
  minHeight: 0,
  opacity: 0,
  visibility: "hidden",
  transition: "all .3s ease-in-out",
  "&.active": {
    visibility: "visible",
    opacity: 0.85,
  },
}));

const ScrollButton = (props: ScrollButtonProps) => {
  const { chatId, wss, bodyEl } = props;
  const [active, setActive] = useState(false);

  const scrollToButtom = () => {
    bodyEl.scrollTo({
      top: bodyEl.scrollHeight,
      behavior: "smooth",
    });
  };

  useLayoutEffect(() => {
    const handleScroll = () => {
      setActive(bodyEl.scrollHeight - bodyEl.scrollTop > 1500);
    };
    bodyEl.addEventListener("scroll", handleScroll);
    return () => {
      bodyEl.removeEventListener("scroll", handleScroll);
    };
  }, [bodyEl]);

  return (
    <StyledButton
      variant="contained"
      color="secondary"
      className={clsx({ active })}
      onClick={scrollToButtom}
    >
      <Badge>
        <KeyboardArrowDownRoundedIcon />
      </Badge>
    </StyledButton>
  );
};

export interface ScrollButtonProps {
  chatId: number;
  wss: MySocket;
  bodyEl: HTMLDivElement;
}

export default ScrollButton;
