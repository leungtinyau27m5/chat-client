import { alpha, Avatar, AvatarProps, Box, styled } from "@mui/material";
import { getProfilePic } from "src/api/chat";
import { Data } from "src/shared/data.proto";
import { onlineStatus } from "../mainMenu/constants";

const StyledBox = styled(Box)(() => ({
  position: "relative",
  "& .status-dot": {
    position: "absolute",
    bottom: '1%',
    right: '1%',
    width: '30%',
    height: '30%',
    maxWidth: 12,
    maxHeight: 12,
    padding: 1,
    display: "flex",
    borderRadius: "50%",
    backgroundColor: "white",
    "& > span": {
      width: "100%",
      height: "100%",
      borderRadius: "inherit",
    },
  },
}));

const AvatarContainer = (props: AvatarContainerProps) => {
  const { src, status, avatarProps } = props;
  const statusColor =
    onlineStatus.find((ele) => ele.value === status)?.color ||
    onlineStatus[0].color;
  return (
    <StyledBox className="avatar-container">
      <Avatar src={src} {...avatarProps} />
      <Box className="status-dot">
        <Box
          component="span"
          sx={{
            backgroundColor: alpha(statusColor, 1),
          }}
        ></Box>
      </Box>
    </StyledBox>
  );
};

export interface AvatarContainerProps {
  src: string;
  status: Data.UserStatus;
  avatarProps?: Omit<AvatarProps, "src">;
}

export default AvatarContainer;
