import { Box, styled } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userSelector } from "src/data/user.atom";
import { Controller } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import LoginForm from "src/components/forms/LoginForm";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import RegisterForm from "src/components/forms/RegisterForm";

const StyledPage = styled(Box)(() => ({
  height: "100vh",
  backgroundColor: "#2A3942",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  "& .app-logo": {
    marginBottom: 25,
  },
  "& .swiper": {
    width: "100vw",
    "& .swiper-slide": {
      width: "100vw",
      height: "fit-content",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
}));

const LoginPage = () => {
  const [searchParam, setSearchParam] = useSearchParams();
  const userData = useRecoilValue(userSelector);
  const [controlledSwiper, setControlledSwiper] = useState<SwiperType | null>(
    null
  );
  const navigate = useNavigate();
  const activeForm = useMemo(() => {
    const tab = searchParam.get("form");
    return tab === "register" ? 1 : 0;
  }, [searchParam]);

  const switchForm = (tab: "register" | "login") => {
    const updatedParam = new URLSearchParams(searchParam.toString());
    updatedParam.set("form", tab);
    setSearchParam(updatedParam.toString());
  };

  useEffect(() => {
    if (!userData) return;
    navigate("/group", { replace: true });
  }, [navigate, userData]);

  useEffect(() => {
    if (!controlledSwiper) return;
    if (controlledSwiper.destroyed) return;
    controlledSwiper.slideTo(activeForm);
  }, [controlledSwiper, activeForm]);

  return (
    <StyledPage className="page login-page">
      <Box className="app-logo">
        <AcUnitRoundedIcon
          sx={{
            width: 75,
            height: 75,
            color: "white",
          }}
        />
      </Box>
      <Swiper
        modules={[Controller]}
        onSwiper={(swiper) => setControlledSwiper(swiper)}
      >
        <SwiperSlide>
          <LoginForm switchForm={switchForm} />
        </SwiperSlide>
        <SwiperSlide>
          <RegisterForm switchForm={switchForm} />
        </SwiperSlide>
      </Swiper>
    </StyledPage>
  );
};

export default LoginPage;
