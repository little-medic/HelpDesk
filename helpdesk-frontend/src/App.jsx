import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import TicketDetails from "./pages/TicketDetails";
import Navbar from "./components/Navbar";

function App() {
    const [loggedIn, setLoggedIn] = useState(
        !!localStorage.getItem("token")
    );

    const [page, setPage] = useState("dashboard");
    const [selectedTicketId, setSelectedTicketId] =
        useState(null);

    function handleLogin() {
        setLoggedIn(true);
        setPage("dashboard");
    }

    function handleLogout() {
        localStorage.removeItem("token");
        setLoggedIn(false);
        setSelectedTicketId(null);
    }

    function handleSelectTicket(ticketId) {
        setSelectedTicketId(ticketId);
        setPage("ticket-details");
    }

    function handleBackToTickets() {
        setSelectedTicketId(null);
        setPage("tickets");
    }

    if (!loggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <>
            <Navbar
                onLogout={handleLogout}
                onNavigate={(destination) => {
                    setSelectedTicketId(null);
                    setPage(destination);
                }}
            />

            {page === "dashboard" && (
                <Dashboard />
            )}

            {page === "tickets" && (
                <Tickets
                    onSelectTicket={handleSelectTicket}
                />
            )}

            {page === "ticket-details" &&
                selectedTicketId && (
                    <TicketDetails
                        ticketId={selectedTicketId}
                        onBack={handleBackToTickets}
                    />
                )}
        </>
    );
}

export default App;