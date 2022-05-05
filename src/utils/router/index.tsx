import { RouteObject } from "react-router-dom";
import loadable from "@loadable/component";

const HomePage = loadable(() => import("src/pages/HomePage"));
// const ChatRoom = loadable(() => import("src/components/chatRoom"));
const AccountPage = loadable(() => import("src/pages/AccountPage"));
const GroupPage = loadable(() => import("src/pages/GroupPage"));
const LoginPage = loadable(() => import("src/pages/LoginPage"));
// const PrivatePage = loadable(() => import("src/pages/PrivatePage"));

const myRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        index: true,
        element: <GroupPage />,
      },
      // {
      //   path: "private",
      //   element: <PrivatePage />,
      //   children: [
      //     {
      //       index: true,
      //       element: <ChatRoom />,
      //     },
      //   ],
      // },
      {
        path: "account",
        element: <AccountPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
];

export default myRoutes;
