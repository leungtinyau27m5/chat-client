import {
  AvatarProps,
  Avatar,
  Dialog,
  DialogContent,
  ButtonBase,
  styled,
  paperClasses,
  dialogContentClasses,
} from "@mui/material";
import { useState } from "react";

const StyledButtonBase = styled(ButtonBase)(() => ({
  borderRadius: "50%",
}));

const StyledDialog = styled(Dialog)(() => ({
  [`& .${paperClasses.root}`]: {
    padding: 0,
    [`& .${dialogContentClasses.root}`]: {
      display: "flex",
      padding: 0,
      "& img": {
        width: "-webkit-fill-available",
      },
    },
  },
}));

const AvatarAndZoom = (props: AvatarAndZoomProps) => {
  const { title, ...avatarProps } = props;
  const [show, setShow] = useState(false);

  const zoomImage = () => {
    if (avatarProps.src !== "") setShow(true);
  };

  return (
    <>
      <StyledButtonBase
        title={title}
        onClick={zoomImage}
        disabled={avatarProps.src === ""}
      >
        <Avatar {...avatarProps} />
      </StyledButtonBase>
      <StyledDialog
        open={show}
        onClose={() => setShow(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent title={title}>
          <img src={avatarProps.src} alt={title} />
        </DialogContent>
      </StyledDialog>
    </>
  );
};

export interface AvatarAndZoomProps extends AvatarProps {
  title: string;
}

export default AvatarAndZoom;
