import axios, { AxiosResponse } from "axios";
import type { AxiosRequestConfig } from "axios";
import { ChatAxios } from "./chat.proto";

type AxiosAction<T, Y> = (
  data: T,
  config?: AxiosRequestConfig<T>
) => Promise<AxiosResponse<Y>>;

const chatAxios = axios.create({
  timeout: 1000 * 15,
  baseURL: process.env.REACT_APP_CHAT_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const postLogin: AxiosAction<
  ChatAxios.Login.Param,
  ChatAxios.Login.Response
> = (data, config) => {
  return chatAxios.post("/user/login", data, config);
};

export const postRegister = () => {
  return chatAxios.post("/user/register");
};

export const getByToken = (token: string, config?: AxiosRequestConfig) => {
  return chatAxios.get<ChatAxios.Login.Response>("/user", config);
};

export const getProfilePic = (param: string) =>
  `${chatAxios.defaults.baseURL}/media/user/${param}`;

export default chatAxios;
