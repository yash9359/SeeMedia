import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import { Button } from "@/components/ui/button";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "./redux/slices/userSlice";
import Explore from "./pages/Explore";
import Reels from "./pages/Reels";
import Message from "./pages/Message";
import SuggestedUsersMainPage from "./pages/SuggestedUsersMainPage";
import AccountEdit from "./pages/AccountEdit";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import PublicRoute from "./PublicRoute/PublicRoute";

function App() {
  const dispatch = useDispatch();
  const { onlineUsers } = useSelector((state) => state.user);

  console.log("onlineUsers : ", onlineUsers);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
    {
      path: "/suggested-users",
      element: (
        <ProtectedRoute>
          <SuggestedUsersMainPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile/:id",
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/account/edit",
      element: (
        <ProtectedRoute>
          <AccountEdit />
        </ProtectedRoute>
      ),
    },
    {
      path: "/explore",
      element: (
        <ProtectedRoute>
          <Explore />
        </ProtectedRoute>
      ),
    },
    {
      path: "/reels",
      element: (
        <ProtectedRoute>
          <Reels />
        </ProtectedRoute>
      ),
    },
    {
      path: "/chats",
      element: (
        <ProtectedRoute>
          <Message />
        </ProtectedRoute>
      ),
    },

    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
