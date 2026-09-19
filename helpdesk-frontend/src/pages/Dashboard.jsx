import { useEffect, useState } from "react";
import { getTickets } from "../api/api";

function Dashboard() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadTickets() {
            try {
                const data = await getTickets();
                setTickets(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadTickets();
    }, []);

    const totalTickets = tickets.length;

    const openTickets = tickets.filter(
        ticket => ticket.status === 0
    ).length;

    const inProgressTickets = tickets.filter(
        ticket => ticket.status === 1
    ).length;

    const resolvedTickets = tickets.filter(
        ticket => ticket.status === 2
    ).length;

    const closedTickets = tickets.filter(
        ticket => ticket.status === 3
    ).length;

    if (loading) {
        return (
            <div className="page">
                <h1>Dashboard</h1>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page">
                <h1>Dashboard</h1>

                <div className="error-message">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <h1>Dashboard</h1>

            <div className="dashboard-grid">
                <div className="stat-card">
                    <h3>Total Tickets</h3>
                    <p>{totalTickets}</p>
                </div>

                <div className="stat-card">
                    <h3>Open Tickets</h3>
                    <p>{openTickets}</p>
                </div>

                <div className="stat-card">
                    <h3>In Progress</h3>
                    <p>{inProgressTickets}</p>
                </div>

                <div className="stat-card">
                    <h3>Resolved</h3>
                    <p>{resolvedTickets}</p>
                </div>

                <div className="stat-card">
                    <h3>Closed</h3>
                    <p>{closedTickets}</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;