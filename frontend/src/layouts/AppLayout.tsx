import { Outlet } from "react-router-dom";
import { AuthProvider } from "../AuthContext";
import Header from "../components/Header";

export default function AppLayout() {
    return (
        <AuthProvider>
            <div className="d-flex flex-column min-vh-100">
                <Header />
                <main className="flex-grow-1">
                    {/*outlet renderar den route som matchar URLen :D */}
                    <Outlet />
                </main>
            </div>
        </AuthProvider>
    );
}

