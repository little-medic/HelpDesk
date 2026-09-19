import { useEffect, useState } from "react";
import {
    getTickets,
    getCategories,
    createTicket
} from "../api/api";

function Tickets({ onSelectTicket }) {
    const [tickets, setTickets] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [creating, setCreating] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: 1,
        categoryId: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            setError("");

            const [ticketData, categoryData] =
                await Promise.all([
                    getTickets(),
                    getCategories()
                ]);

            setTickets(ticketData);
            setCategories(categoryData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                name === "priority" ||
                    name === "categoryId"
                    ? Number(value)
                    : value
        }));
    }

    async function handleCreate(event) {
        event.preventDefault();

        try {
            setCreating(true);
            setError("");

            await createTicket(form);

            setForm({
                title: "",
                description: "",
                priority: 1,
                categoryId: ""
            });

            setShowCreateForm(false);

            await loadData();
        } catch (err) {
            setError(err.message);
        } finally {
            setCreating(false);
        }
    }

    function getStatusName(status) {
        switch (status) {
            case 0:
                return "Open";
            case 1:
                return "In Progress";
            case 2:
                return "Resolved";
            case 3:
                return "Closed";
            default:
                return "Unknown";
        }
    }

    function getPriorityName(priority) {
        switch (priority) {
            case 0:
                return "Low";
            case 1:
                return "Medium";
            case 2:
                return "High";
            case 3:
                return "Critical";
            default:
                return "Unknown";
        }
    }

    return (
        <div className="page">

            <div className="page-header">
                <div>
                    <h1>Tickets</h1>

                    <p className="page-subtitle">
                        Manage and track support requests
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() =>
                        setShowCreateForm(true)
                    }
                >
                    + Create Ticket
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {showCreateForm && (
                <div className="modal-overlay">
                    <div className="modal">

                        <div className="modal-header">
                            <h2>Create Ticket</h2>

                            <button
                                className="close-button"
                                onClick={() =>
                                    setShowCreateForm(false)
                                }
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCreate}>

                            <label>
                                Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Enter ticket title"
                                required
                            />

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe the issue"
                                rows="5"
                                required
                            />

                            <label>
                                Priority
                            </label>

                            <select
                                name="priority"
                                value={form.priority}
                                onChange={handleChange}
                            >
                                <option value={0}>
                                    Low
                                </option>

                                <option value={1}>
                                    Medium
                                </option>

                                <option value={2}>
                                    High
                                </option>

                                <option value={3}>
                                    Critical
                                </option>
                            </select>

                            <label>
                                Category
                            </label>

                            <select
                                name="categoryId"
                                value={form.categoryId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select a category
                                </option>

                                {categories.map(
                                    (category) => (
                                        <option
                                            key={
                                                category.categoryId
                                            }
                                            value={
                                                category.categoryId
                                            }
                                        >
                                            {category.name}
                                        </option>
                                    )
                                )}
                            </select>

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() =>
                                        setShowCreateForm(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={creating}
                                >
                                    {creating
                                        ? "Creating..."
                                        : "Create Ticket"}
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}

            {loading && (
                <p>Loading tickets...</p>
            )}

            {!loading &&
                !error &&
                tickets.length === 0 && (
                    <div className="empty-state">
                        <h3>No tickets found</h3>

                        <p>
                            There are currently no
                            support tickets.
                        </p>
                    </div>
                )}

            {!loading &&
                !error &&
                tickets.length > 0 && (
                    <div className="table-container">

                        <table className="tickets-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Ticket</th>
                                    <th>Category</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Created By</th>
                                    <th>Assigned To</th>
                                </tr>
                            </thead>

                            <tbody>

                                {tickets.map((ticket) => (
                                    <tr
                                        key={ticket.ticketId}
                                        onClick={() =>
                                            onSelectTicket(ticket.ticketId)
                                        }
                                        className="clickable-row"
                                    >
                                        <td>
                                            #
                                            {
                                                ticket.ticketId
                                            }
                                        </td>

                                        <td>
                                            <div className="ticket-title">
                                                {
                                                    ticket.title
                                                }
                                            </div>

                                            <div className="ticket-description">
                                                {
                                                    ticket.description
                                                }
                                            </div>
                                        </td>

                                        <td>
                                            {
                                                ticket.category
                                            }
                                        </td>

                                        <td>
                                            <span
                                                className={`priority-badge priority-${ticket.priority}`}
                                            >
                                                {getPriorityName(
                                                    ticket.priority
                                                )}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`status-badge status-${ticket.status}`}
                                            >
                                                {getStatusName(
                                                    ticket.status
                                                )}
                                            </span>
                                        </td>

                                        <td>
                                            {
                                                ticket.createdBy
                                            }
                                        </td>

                                        <td>
                                            {
                                                ticket.assignedTo ||
                                                "Unassigned"
                                            }
                                        </td>
                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}
        </div>
    );
}

export default Tickets;