import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "../AuthContext";
import Header from "../components/Header";

export default function AppLayout() {
    const location = useLocation();
    const pathParts = location.pathname.split('/').filter(p => p);
    
    // /messages -> ['messages'] -> length 1
    // /messages/user123 -> ['messages', 'user123'] -> length 2
    const isConversationPage = pathParts[0] === 'messages' && pathParts.length > 1;

    return (
        <AuthProvider>
            <div className="d-flex flex-column min-vh-100">
                {!isConversationPage && <Header />}
                <main className="flex-grow-1">
                    {/*outlet renderar den route som matchar URLen :D */}
                    <Outlet />
                </main>
            </div>
        </AuthProvider>
    );
}

