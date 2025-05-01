import { Routes, Route } from "react-router";
import PrivateRoute from "../security/Privatepage";
import BusinessForm from "../../signup/subscription/signup/companies/Details";
import Login from "../../login/page";
import Subscrptionmain from "../../signup/subscription/sub";
import SignupMain from "../../signup/subscription/signup/signup";
import Error from "../../error";

export default function MainWebRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route index element={<Login />} />
      <Route path="/subscription/signup" element={<SignupMain />} />
      <Route
        path="/subscription/signup/details"
        element={<PrivateRoute Component={BusinessForm} />}
      />
      <Route path="/subscription" element={<Subscrptionmain />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
}
