import ResponsiveSidebar from "../navigation/ResponsiveSidebar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoute from "../security/Privatepage";
import CalendarPage from "../../dashboard/calender/page";
import Error from "../../error";
import TemplatePage from "../../dashboard/template/page";
import Editpost from "../../dashboard/edit/Editpost";
import PostAnalysis from "../../dashboard/posts/analysis/page";
import Pending from "../../dashboard/posts/page";
import Profile from "../../dashboard/profile/Profile";
import Submanagement from "../../dashboard/subscriptionmanagment/Submanagement";
import PostCreation from "../../dashboard/creat/post/PostCreation";

// function DashboardRouteDefination() {
//   const router = createBrowserRouter([
//     // Direct routes with PrivateRoute applied to each protected route
//     { path: "/dashboard", element: <CalendarPage /> },

//     {
//       path: "/dashboard/profile",
//       element: <Profile />,
//       // element: <Profile />,
//     },
//     {
//       path: "/dashboard/subscription",
//       element: <Submanagement />,
//     },
//     {
//       path: "/dashboard/create",
//       element: <PostCreation />,
//     },
//     {
//       path: "/dashboard/create/post",
//       element: <PostCreation />,
//     },
//     { path: "/dashboard/posts", element: <Pending /> },
//     { path: "/dashboard/calender", element: <CalendarPage /> },
//     {
//       path: "/dashboard/analize/:postId",
//       element: <PostAnalysis />,
//     },
//     {
//       path: "/dashboard/posts/edit/:postId",
//       element: <Editpost />,
//     },
//     {
//       path: "/dashboard/templates",
//       element: <TemplatePage />,
//     },

//     { path: "*", element: <Error /> },
//   ]);

//   return (
//     <div className="w-full flex flex-row justify-center items-start">
//       <div className="navbarzone w-fit">
//         <ResponsiveSidebar pagename={"calendar"} />
//       </div>
//       <div className="w-full">
//         <RouterProvider router={router} />
//       </div>
//     </div>
//   );
// }

// export default function DashboardRoutes() {
//   return <PrivateRoute Component={DashboardRouteDefination} />;
// }

export default function DashboardRoutes() {
  const router = createBrowserRouter([
    // Direct routes with PrivateRoute applied to each protected route
    { path: "/dashboard", element: <CalendarPage /> },

    {
      path: "/dashboard/profile",
      element: <Profile />,
      // element: <Profile />,
    },
    {
      path: "/dashboard/subscription",
      element: <Submanagement />,
    },
    {
      path: "/dashboard/create",
      element: <PostCreation />,
    },
    {
      path: "/dashboard/create/post",
      element: <PostCreation />,
    },
    { path: "/dashboard/posts", element: <Pending /> },
    { path: "/dashboard/calender", element: <CalendarPage /> },
    {
      path: "/dashboard/analize/:postId",
      element: <PostAnalysis />,
    },
    {
      path: "/dashboard/posts/edit/:postId",
      element: <Editpost />,
    },
    {
      path: "/dashboard/templates",
      element: <TemplatePage />,
    },

    { path: "*", element: <Error /> },
  ]);

  return (
    <div className="w-full flex flex-row justify-center items-start">
      <div className="navbarzone w-fit">
        <ResponsiveSidebar pagename={"calendar"} />
      </div>
      <div className="w-full">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}
