import { useLocation } from "react-router-dom";
import PrivateRoute from "./components/security/Privatepage";
import DashboardRoutes from "./components/routes/DashboardRoutes";
import MainWebRoutes from "./components/routes/MainWebRoutes";

function App() {
  const location = useLocation();

  return (
    <div className="w-full bg-background text-text text-md sm:text-xl overflow-hidden flex flex-col justify-center items-center">
      {location.pathname.startsWith("/dashboard") ? (
        <PrivateRoute content={<DashboardRoutes />} />
      ) : (
        <MainWebRoutes />
      )}
    </div>
  );
}

export default App;
