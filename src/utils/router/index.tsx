import { RouteObject } from "react-router-dom";
import AccountPage from "src/pages/AccountPage";
import GroupPage from "src/pages/GroupPage";
import HomePage from "src/pages/HomePage";
import LoginPage from "src/pages/LoginPage";
import PrivatePage from "src/pages/PrivatePage";

const myRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "group",
        element: <GroupPage />,
      },
      {
        path: "private",
        element: <PrivatePage />,
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
