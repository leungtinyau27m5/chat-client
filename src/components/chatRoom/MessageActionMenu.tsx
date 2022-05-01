import {
  Avatar,
  Box,
  Divider,
  dividerClasses,
  IconButton,
  iconButtonClasses,
  listClasses,
  ListItemText,
  Menu,
  MenuItem,
  menuItemClasses,
  MenuProps,
  styled,
  Typography,
} from "@mui/material";
import { ReactElement } from "react";

const StyledActionMenu = styled(Menu)(({ theme }) => ({
  [`& .${listClasses.root}`]: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    [`& .${dividerClasses.root}`]: {
      marginTop: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
    },
    [`& .${menuItemClasses.root}`]: {
      padding: `${theme.spacing(0.7)} ${theme.spacing(2.2)}`,
    },
  },
}));

const MessageActionMenu = (props: MessageActionMenuProps) => {
  const { open, anchorEl, menuProps, handleAction } = props;
  return (
    <StyledActionMenu open={open} anchorEl={anchorEl} {...menuProps}>
      <MenuItem onClick={() => handleAction("select")}>
        <Typography variant="caption">Select</Typography>
      </MenuItem>
      <MenuItem onClick={() => handleAction("edit")}>
        <Typography variant="caption">Edit</Typography>
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => handleAction("delete")}>
        <Typography variant="caption" color="error">
          Delete
        </Typography>
      </MenuItem>
    </StyledActionMenu>
  );
};

export interface MessageActionMenuProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  handleAction: (type: "select" | "edit" | "delete") => void;
  menuProps?: Omit<MenuProps, "open" | "anchorEl">;
}

export default MessageActionMenu;
