import { CircleRounded } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Typography,
  styled,
  avatarClasses,
  Select,
  filledInputClasses,
  alpha,
  MenuItem,
  ListItemIcon,
  ListItemText,
  SelectChangeEvent,
} from "@mui/material";
import { useMemo } from "react";
import { getProfilePic } from "src/api/chat";
import { UserState } from "src/data/user.atom";
import { useChatSocketCtx } from "src/providers/socket.io/chat/context";
import { Data } from "src/shared/data.proto";
import { onlineStatus } from "./constants";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  rowGap: theme.spacing(1.1),
  "& .avatar-container": {
    position: "relative",
    [`& .${avatarClasses.root}`]: {
      width: 110,
      height: 110,
    },
    "& .status-dot": {
      position: "absolute",
      bottom: 10,
      right: 10,
      width: 12,
      height: 12,
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
  },
  "& .status-inner": {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
}));

const StyledSelect = styled(Select)(() => ({
  width: "100%",
  maxWidth: 140,
  borderRadius: 10,
  fontSize: "0.95rem",
  transition: "all .3s ease-in-out",
  overflow: "hidden",
  "&:hover, &.Mui-focused": {
    opacity: 0.85,
  },
  [`& .${filledInputClasses.input}`]: {
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    textAlign: "center",
  },
}));

const UserStatus = (props: UserStatusProps) => {
  const { userData } = props;
  const { wss } = useChatSocketCtx();
  const statusColor = useMemo(() => {
    return (
      onlineStatus.find((ele) => ele.value === userData.status)?.color ||
      onlineStatus[0].color
    );
  }, [userData.status]);

  const handleStatusOnChange = (evt: SelectChangeEvent<unknown>) => {
    const value = evt.target.value as Data.UserStatus;
    wss.emit("user:status", value);
  };

  return (
    <StyledBox className="user-status-container">
      <Box className="avatar-container">
        <Avatar
          src={userData.profile_pic ? getProfilePic(userData?.profile_pic) : ""}
        />
        <Box className="status-dot">
          <Box
            component="span"
            sx={{
              backgroundColor: alpha(statusColor, 1),
            }}
          />
        </Box>
      </Box>
      <Typography variant="h5" align="center">
        {userData?.username}
      </Typography>
      <Box className="status-inner">
        <StyledSelect
          label="Status"
          variant="filled"
          disableUnderline
          value={userData.status}
          onChange={handleStatusOnChange}
          renderValue={(value) => <span>{value as string}</span>}
          sx={{
            backgroundColor: alpha(statusColor, 0.15),
            color: statusColor,
            "&:hover, &.Mui-focused": {
              backgroundColor: alpha(statusColor, 0.15),
            },
          }}
        >
          {onlineStatus.map((status) => (
            <MenuItem
              key={status.value}
              value={status.value}
              sx={{ display: "flex" }}
            >
              <ListItemIcon>
                <CircleRounded sx={{ color: status.color }} />
              </ListItemIcon>
              <ListItemText>{status.text}</ListItemText>
            </MenuItem>
          ))}
        </StyledSelect>
      </Box>
    </StyledBox>
  );
};

export interface UserStatusProps {
  userData: UserState.Atom;
}

export default UserStatus;
