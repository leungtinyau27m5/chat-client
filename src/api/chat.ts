import axios, { AxiosResponse } from "axios";
import type { AxiosRequestConfig } from "axios";
import { ChatAxios } from "./chat.proto";
import { ExpressCodeMap } from "./express.proto";
import { getFormData } from "src/helpers/common";

type AxiosAction<T, Y> = (
  data: T,
  config?: AxiosRequestConfig<T>
) => Promise<AxiosResponse<Y>>;

const chatAxios = axios.create({
  timeout: 1000 * 15,
  baseURL: process.env.REACT_APP_CHAT_API,
  withCredentials: true,
});

export const postLogin: AxiosAction<
  ChatAxios.Login.Param,
  ChatAxios.Login.Response
> = (data, config = {}) => {
  return chatAxios.post("/user/login", data, config);
};

export const postRegister = (
  data: ChatAxios.Register.Param,
  config?: AxiosRequestConfig<ChatAxios.Register.Param>
) => {
  config ??= {};
  const formData = getFormData(data);
  return chatAxios.post<ChatAxios.Login.Response>("/user/register", formData, {
    ...config,
    headers: {
      ...config.headers,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getByToken = (token: string, config?: AxiosRequestConfig) => {
  return chatAxios.get<ChatAxios.Login.Response>("/user", config);
};

export const postProfilePic = (data: { profilePic: File }) => {
  const formData = getFormData(data);
  return chatAxios.post<{ code: ExpressCodeMap; file?: string }>(
    "/media/chat/profilePic",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const getProfilePic = (param: string) =>
  `${chatAxios.defaults.baseURL}/media/user/${param}`;

export const getChatProfilePic = (param: string) =>
  `${chatAxios.defaults.baseURL}/media/chat/${param}`;

export default chatAxios;
