import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssistantRoundedIcon from '@mui/icons-material/AssistantRounded';

export const menuItems = [
  {
    path: "/group",
    icon: <GroupsRoundedIcon />,
  },
  {
    path: "/private",
    icon: <AssistantRoundedIcon />,
  },
  {
    path: "/friends",
    icon: <PeopleRoundedIcon />,
  },
];

export const onlineStatus = [
  {
    value: "available",
    text: "available",
    color: "#00A389",
  },
  {
    value: "busy",
    text: "busy",
    color: "#FFA726",
  },
  {
    value: "leave",
    text: "leave",
    color: "#F44336",
  },
  {
    value: "offline",
    text: "offline",
    color: "#8A8C97",
  },
];
