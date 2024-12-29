import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error from "./error";
import Editor from "./pages/editor/page";

const router = createBrowserRouter([
  { path: "/", element: <Editor /> },

  { path: "*", element: <Error /> }
]);

function App() {
  return (
    <div className="w-full bg-background text-text text-md sm:text-xl overflow-hidden flex flex-col justify-center items-center">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
