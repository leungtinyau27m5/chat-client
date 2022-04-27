import {
  filledInputClasses,
  styled,
  TextField,
  Select,
  formHelperTextClasses,
} from "@mui/material";

export const StyledTextField = styled(TextField)(({ theme }) => ({
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
        paddingTop: "1rem",
        paddingBottom: "1rem",
        marginRight: 12,
      },
    },
  },
  [`& .${formHelperTextClasses.root}`]: {
    color: theme.palette.error.main,
  },
}));

export const StyledSelect = styled(Select)(() => ({}));
