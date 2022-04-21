import { RouteObject } from "react-router-dom";
import ChatRoom from "src/components/chatRoom";
import AccountPage from "src/pages/AccountPage";
import GroupPage from "src/pages/GroupPage";
import HomeDefault from "src/pages/HomeDefault";
import HomePage from "src/pages/HomePage";
import LoginPage from "src/pages/LoginPage";
import PrivatePage from "src/pages/PrivatePage";

const myRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        index: true,
        element: <HomeDefault />,
      },
      {
        path: "group",
        element: <GroupPage />,
        children: [
          {
            index: true,
            element: <ChatRoom />,
          },
        ],
      },
      {
        path: "private",
        element: <PrivatePage />,
        children: [
          {
            element: <ChatRoom />,
          },
        ],
      },
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
