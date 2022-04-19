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
import { useRef, useState } from "react";
import { getProfilePic } from "src/api/chat";
import { UserState } from "src/data/user.atom";
import { onlineStatus } from "./constants";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  rowGap: theme.spacing(1.1),
  [`& .${avatarClasses.root}`]: {
    width: 110,
    height: 110,
  },
  "& .status-inner": {
    width: "100%",
    display: 'flex',
    justifyContent: 'center'
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
  const [status, setStatus] = useState(onlineStatus[0].value);
  const statusColor = useRef(onlineStatus[0].color);

  const handleStatusOnChange = (evt: SelectChangeEvent<unknown>) => {
    const value = evt.target.value as string;
    statusColor.current =
      onlineStatus.find((ele) => ele.value === value)?.color ||
      onlineStatus[0].color;
    setStatus(value);
  };

  return (
    <StyledBox className="user-status-container">
      <Avatar
        src={userData.profile_pic ? getProfilePic(userData?.profile_pic) : ""}
      />
      <Typography variant="h5" align="center">
        {userData?.username}
      </Typography>
      <Box className="status-inner">
        <StyledSelect
          label="Status"
          variant="filled"
          disableUnderline
          value={status}
          onChange={handleStatusOnChange}
          renderValue={(value) => <span>{value as string}</span>}
          sx={{
            backgroundColor: alpha(statusColor.current, 0.15),
            color: statusColor.current,
            "&:hover, &.Mui-focused": {
              backgroundColor: alpha(statusColor.current, 0.15),
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
