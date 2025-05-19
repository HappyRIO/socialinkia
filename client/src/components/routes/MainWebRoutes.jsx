import { Routes, Route } from "react-router";
import BusinessForm from "../../signup/subscription/signup/companies/Details";
import Home from "../../page";
import Login from "../../login/page";
import Contact from "../../contact/page";
import Aboutus from "../page/about/Aboutus";
import Subscrptionmain from "../../signup/subscription/sub";
import SignupMain from "../../signup/subscription/signup/signup";
import Error from "../../error";

export default function MainWebRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/subscription/signup" element={<SignupMain />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/aboutus" element={<Aboutus />} />
      <Route
        path="/subscription/signup/details"
        element={<BusinessForm />}
      />
      <Route path="/subscription" element={<Subscrptionmain />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
}
