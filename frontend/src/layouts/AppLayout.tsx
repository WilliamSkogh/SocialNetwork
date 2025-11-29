import { Outlet } from "react-router-dom";
import { AuthProvider } from "../AuthContext";

export default function AppLayout() {
    return (
        <AuthProvider>
            <div>
                <header>
                    <h1>Social Network</h1>
                </header>
                <main>
                    {/*outlet renderar den route som matchar URLen :D */}
                    <Outlet />
                </main>
            </div>
        </AuthProvider>
    );
}

