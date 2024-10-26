import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Blog } from "./pages/Blog";
import { Blogs } from "./pages/Blogs";
import { Publish } from "./pages/Publish";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const isAccessTokenAvailable = () => {
    if (localStorage.getItem("token")) return true;
    else return false;
  };

  const router = createBrowserRouter([
    {
      path: "/signup",
      element: <Signup />,
      index: true,
    },
    {
      path: "/signin",
      element: <Signin />,
      index: true,
    },
    {
      element: <ProtectedRoute isAuthenticated={isAccessTokenAvailable()} />,
      children: [
        {
          path: "/blog/:id",
          element: <Blog />,
        },
        {
          path: "/blogs",
          element: <Blogs />,
        },
        {
          path: "/publish",
          element: <Publish />,
        },
      ],
    },
    {
      path: "*",
      element: isAccessTokenAvailable() ? (
        <Navigate to="/blogs" />
      ) : (
        <Navigate to="/signup" />
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
