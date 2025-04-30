import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoute from "../security/Privatepage";
import BusinessForm from "../../signup/subscription/signup/companies/Details";
import Home from "../../page";
import Login from "../../login/page";
import Contact from "../../contact/page";
import Aboutus from "../page/about/Aboutus";
import Subscrptionmain from "../../signup/subscription/sub";
import SignupMain from "../../signup/subscription/signup/signup";
import Error from "../../error";

export default function MainWebRoutes() {
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/contact", element: <Contact /> },
    { path: "/about", element: <Aboutus /> },
    { path: "/subscription", element: <Subscrptionmain /> },
    { path: "/subscription/signup", element: <SignupMain /> },
    {
      path: "/subscription/signup/details",
      element: <PrivateRoute Component={BusinessForm} />,
    },

    { path: "*", element: <Error /> },
  ]);
  return (
    <div className="w-full">
      <RouterProvider router={router} />
    </div>
  );
}
