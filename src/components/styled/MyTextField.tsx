import { filledInputClasses, styled, TextField } from "@mui/material";

export const StyledTextField = styled(TextField)(() => ({
  [`& .${filledInputClasses.root}`]: {
    borderRadius: 12,
    [`&.${filledInputClasses.adornedStart}`]: {
      [`& .${filledInputClasses.input}`]: {
        paddingTop: "1rem",
        paddingBottom: "1rem",
        marginLeft: 12,
      },
    },
    [`&.${filledInputClasses.adornedEnd}`]: {
      [`& .${filledInputClasses.input}`]: {
        marginRight: 12,
      },
    },
  },
}));
