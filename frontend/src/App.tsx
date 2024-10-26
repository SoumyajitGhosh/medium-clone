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
import { CustomToaster } from "./components/ToastAlert";
import { AuthProvider, useAuth } from "./AuthContext";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  const router = createBrowserRouter([
    {
      path: "/signup",
      element: isAuthenticated ? <Navigate to="/blogs" /> : <Signup />,
    },
    {
      path: "/signin",
      element: isAuthenticated ? <Navigate to="/blogs" /> : <Signin />,
    },
    {
      element: <ProtectedRoute isAuthenticated={isAuthenticated} />,
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
      element: isAuthenticated ? (
        <Navigate to="/blogs" />
      ) : (
        <Navigate to="/signup" />
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

function App() {
  return (
    <AuthProvider>
      <CustomToaster />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
