import { Box, IconButton, styled } from "@mui/material";
import { menuAtom } from "src/data/menu.atom";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import { useSetRecoilState } from "recoil";

const StyledBox = styled(Box)(() => ({
  backgroundColor: "#EDF0F6",
  "& .head": {
    height: 54,
    display: "flex",
    alignItems: "center",
    padding: "0 1rem",
    paddingLeft: "0.5rem",
    justifyContent: "space-between",
    boxShadow: "0px 2px 15px rgba(15, 15, 15, 0.05)",
  }
}));

const HomeDefault = () => {
  const setShowMenu = useSetRecoilState(menuAtom);
  return (
    <StyledBox>
      <Box className="head">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => setShowMenu(true)} sx={{ mr: 1 }}>
            <MenuOpenRoundedIcon />
          </IconButton>
        </Box>
      </Box>
    </StyledBox>
  );
};

export default HomeDefault;
