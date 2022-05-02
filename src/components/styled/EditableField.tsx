import { useEffect, useRef, useState } from "react";
import {
  Box,
  ButtonBase,
  ClickAwayListener,
  Menu,
  styled,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { StyledTextField } from "./MyTextField";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import TagFacesRoundedIcon from "@mui/icons-material/TagFacesRounded";
import Picker, { IEmojiData } from "emoji-picker-react";
import { Controller, useForm } from "react-hook-form";

const StyledBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  "& .default-value": {
    cursor: "text",
    paddingLeft: 8,
    paddingRight: 8,
    position: "relative",
    "&:hover": {
      backgroundColor: "rgba(15, 15, 15, 0.05)",
      "& .btn-edit": {
        opacity: 1,
        right: -30,
      },
    },
    "& .btn-edit": {
      fontSize: 12,
      color: "dark",
      position: "absolute",
      right: -40,
      top: "50%",
      transform: "translateY(-50%)",
      opacity: 0,
      transition: "all .2s ease-in-out",
      borderRadius: "50%",
      padding: 5,
    },
  },
}));

const EditableField = (props: EditableFieldProps) => {
  const { defaultValue, handleOnSubmit } = props;
  const [onEdit, setOnEdit] = useState(false);
  const [showEmoji, setShowEmojji] = useState(false);
  const { control, setFocus, setValue, getValues, reset } =
    useForm<EditableFieldForm>();
  const me = useRef<HTMLDivElement>(null);

  const onEmojiRes = (data: IEmojiData) => {
    setValue("item", getValues("item") + data.emoji);
    setFocus("item");
  };

  const handleOnConfirm = () => {
    handleOnSubmit(getValues("item"));
    setOnEdit(false);
  };

  useEffect(() => {
    if (!onEdit) reset({ item: defaultValue });
  }, [defaultValue, onEdit, reset]);

  return (
    <StyledBox ref={me}>
      {!onEdit ? (
        <Box className="default-value">
          {defaultValue}
          <ButtonBase className="btn-edit" onClick={() => setOnEdit(true)}>
            <EditRoundedIcon fontSize="small" />
          </ButtonBase>
        </Box>
      ) : (
        <ClickAwayListener onClickAway={() => setOnEdit(false)}>
          <Box className="text-field-container">
            <Controller
              control={control}
              name="item"
              defaultValue={defaultValue}
              render={({ field: { ref, ...field } }) => (
                <StyledTextField
                  variant="filled"
                  autoFocus={true}
                  inputProps={{
                    style: {
                      paddingTop: 8,
                      paddingBottom: 8,
                    },
                  }}
                  inputRef={ref}
                  {...field}
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: (
                      <Box sx={{ display: "flex" }}>
                        <ButtonBase onClick={() => setShowEmojji(true)}>
                          <TagFacesRoundedIcon
                            fontSize="small"
                            color="secondary"
                          />
                        </ButtonBase>
                        <ButtonBase onClick={handleOnConfirm}>
                          <CheckRoundedIcon fontSize="small" color="success" />
                        </ButtonBase>
                      </Box>
                    ),
                  }}
                />
              )}
            />
            <Menu
              open={showEmoji}
              anchorEl={me.current}
              onClose={() => setShowEmojji(false)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Picker
                disableAutoFocus
                onEmojiClick={(evt, data) => onEmojiRes(data)}
              />
            </Menu>
          </Box>
        </ClickAwayListener>
      )}
    </StyledBox>
  );
};

export interface EditableFieldForm {
  item: string;
}

export interface EditableFieldProps {
  defaultValue: string;
  handleOnSubmit: (value: string) => void;
}

export default EditableField;
