import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import AppLayout from "./layouts/AppLayout";

export const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <div>Startsida {/*ska väl vara <HomePage/> här */}</div>
            },
            {
                path: "/register",
                element: <RegisterPage />
            }
        ]
    }
]);
