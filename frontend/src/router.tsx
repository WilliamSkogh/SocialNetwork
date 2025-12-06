import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import PostsPage from "./pages/PostsPage";
import ProfilePage from "./pages/ProfilePage";

export const router = createBrowserRouter([

    {

        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <PostsPage />
            },
            {
                path: "/register",
                element: <RegisterPage />
            },
            {
                path: "/login",
                element: <LoginPage />
            },
            {
                path: "/posts",
                element: <PostsPage />
            },
            {
                path: "/profile/:username",
                element: <ProfilePage />
            }
        ]
    }

]
);
