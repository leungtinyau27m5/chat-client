import { ChangeEvent, ReactNode, useState } from "react";
import { styled, Box, TextField, IconButton } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

const StyledBox = styled(Box)(() => ({
  position: "relative",
  padding: "0.75rem 1.2rem",
  width: "100%",
  "& .file-upload-input": {
    display: "none",
  },
  "& .file-upload-label": {
    cursor: "pointer",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  "& .button-remove": {
    position: "absolute",
    top: 0,
    right: 0,
  },
}));

const FileUploader = (props: FileUploaderProps) => {
  const { accept, id, handleFilesChange } = props;
  const [fileList, setFileList] = useState<FileList | null>(null);

  const handleOnChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setFileList(evt.target.files);
    handleFilesChange(evt.target.files);
  };

  const removeFileList = () => {
    setFileList(null);
    handleFilesChange(null);
  };

  return (
    <StyledBox className="file-uploader-container">
      <TextField
        type="file"
        className="file-upload-input"
        id={id}
        onChange={handleOnChange}
        inputProps={{
          accept: accept,
        }}
      />
      <Box component="label" className="file-upload-label" htmlFor={id}>
        {props.children(fileList)}
      </Box>
      {fileList && (
        <IconButton className="button-remove" onClick={removeFileList}>
          <DeleteRoundedIcon color="error" />
        </IconButton>
      )}
    </StyledBox>
  );
};

export interface FileUploaderProps {
  id: string;
  accept: string;
  children: (fileList: FileList | null) => ReactNode;
  handleFilesChange: (fileList: FileList | null) => void;
}

export default FileUploader;
