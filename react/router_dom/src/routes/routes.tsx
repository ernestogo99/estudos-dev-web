import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/homepage";
import Page2 from "../pages/page2";
import NotFound from "../pages/notFound";
import Profiles from "../pages/profiles";
import ProfilePage from "../pages/profilepage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFound />,
  },
  {
    path: "/page2",
    element: <Page2 />,
  },
  {
    path: "/profiles",
    element: <Profiles />,
    children: [
      {
        path: "/profiles/:id",
        element: <ProfilePage />,
      },
    ],
  },
]);
