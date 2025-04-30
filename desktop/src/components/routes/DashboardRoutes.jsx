import { Routes, Route } from "react-router-dom";
import ResponsiveSidebar from "../navigation/ResponsiveSidebar";
import CalendarPage from "../../dashboard/calender/page";
import Error from "../../error";
import TemplatePage from "../../dashboard/template/page";
import Editpost from "../../dashboard/edit/Editpost";
import PostAnalysis from "../../dashboard/posts/analysis/page";
import Pending from "../../dashboard/posts/page";
import Profile from "../../dashboard/profile/Profile";
import Submanagement from "../../dashboard/subscriptionmanagment/Submanagement";
import PostCreation from "../../dashboard/creat/post/PostCreation";

export default function DashboardRoutes() {
  return (
    <Routes>
      <div className="w-full flex flex-row justify-center items-start">
        <div className="navbarzone w-fit">
          <ResponsiveSidebar pagename={"dashboard"} />
        </div>
        <div className="w-full">
          <Route path="/dashboard" element={<CalendarPage />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/subscription" element={<Submanagement />} />
          <Route path="/dashboard/create" element={<PostCreation />} />
          <Route path="/dashboard/create/post" element={<PostCreation />} />
          <Route path="/dashboard/posts" element={<Pending />} />
          <Route path="/dashboard/analize/:postId" element={<PostAnalysis />} />
          <Route path="/dashboard/posts/edit/:postId" element={<Editpost />} />
          <Route path="/dashboard/templates" element={<TemplatePage />} />
          <Route path="*" element={<Error />} />
        </div>
      </div>
    </Routes>
  );
}
