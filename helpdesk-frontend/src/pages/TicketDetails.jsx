import { useEffect, useState } from "react";
import {
    getTicketById,
    changeTicketStatus,
    addTicketComment,
    updateTicket,
    assignTicket,
    getCategories,
    getUsers
} from "../api/api";

function TicketDetails({ ticketId, onBack }) {
    const [ticket, setTicket] = useState(null);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [newStatus, setNewStatus] = useState("");
    const [comment, setComment] = useState("");

    const [editing, setEditing] = useState(false);
    const [savingEdit, setSavingEdit] = useState(false);

    const [assigning, setAssigning] = useState(false);
    const [selectedUser, setSelectedUser] = useState("");

    const [savingStatus, setSavingStatus] = useState(false);
    const [addingComment, setAddingComment] = useState(false);

    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        priority: 1,
        categoryId: ""
    });

    useEffect(() => {
        loadTicket();
        loadManagementData();
    }, [ticketId]);

    async function loadTicket() {
        try {
            setLoading(true);
            setError("");

            const data = await getTicketById(ticketId);

            setTicket(data);
            setNewStatus(data.status);

            setEditForm({
                title: data.title,
                description: data.description,
                priority: data.priority,
                categoryId: data.category.categoryId
            });

            setSelectedUser(
                data.assignedTo
                    ? data.assignedTo.userId
                    : ""
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function loadManagementData() {
        try {
            const [categoryData, userData] =
                await Promise.all([
                    getCategories(),
                    getUsers()
                ]);

            setCategories(categoryData);
            setUsers(userData);
        } catch {
            // Employees cannot access /api/Users.
            // The ticket itself still loads normally.
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

    function handleEditChange(event) {
        const { name, value } = event.target;

        setEditForm((previous) => ({
            ...previous,
            [name]:
                name === "priority" ||
                    name === "categoryId"
                    ? Number(value)
                    : value
        }));
    }

    async function handleSaveEdit(event) {
        event.preventDefault();

        try {
            setSavingEdit(true);
            setError("");

            await updateTicket(
                ticketId,
                editForm
            );

            setEditing(false);

            await loadTicket();
        } catch (err) {
            setError(err.message);
        } finally {
            setSavingEdit(false);
        }
    }

    async function handleStatusChange() {
        if (Number(newStatus) === ticket.status) {
            return;
        }

        try {
            setSavingStatus(true);
            setError("");

            await changeTicketStatus(
                ticketId,
                Number(newStatus)
            );

            await loadTicket();
        } catch (err) {
            setError(err.message);
        } finally {
            setSavingStatus(false);
        }
    }

    async function handleAssignment() {
        if (!selectedUser) {
            return;
        }

        try {
            setAssigning(true);
            setError("");

            await assignTicket(
                ticketId,
                Number(selectedUser)
            );

            await loadTicket();
        } catch (err) {
            setError(err.message);
        } finally {
            setAssigning(false);
        }
    }

    async function handleAddComment(event) {
        event.preventDefault();

        if (!comment.trim()) {
            return;
        }

        try {
            setAddingComment(true);
            setError("");

            await addTicketComment(
                ticketId,
                comment.trim()
            );

            setComment("");

            await loadTicket();
        } catch (err) {
            setError(err.message);
        } finally {
            setAddingComment(false);
        }
    }

    if (loading) {
        return (
            <div className="page">
                <button
                    className="secondary-button"
                    onClick={onBack}
                >
                    ? Back to Tickets
                </button>

                <p>Loading ticket...</p>
            </div>
        );
    }

    if (error && !ticket) {
        return (
            <div className="page">
                <button
                    className="secondary-button"
                    onClick={onBack}
                >
                    ? Back to Tickets
                </button>

                <div className="error-message">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="page">

            <div className="page-header">
                <div>
                    <button
                        className="secondary-button"
                        onClick={onBack}
                    >
                        ? Back to Tickets
                    </button>

                    <h1 className="ticket-detail-title">
                        #{ticket.ticketId} {ticket.title}
                    </h1>

                    <p className="page-subtitle">
                        Created by {ticket.createdBy.email}
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() =>
                        setEditing(!editing)
                    }
                >
                    {editing ? "Cancel Edit" : "Edit Ticket"}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {editing && (
                <div className="detail-card edit-card">

                    <h2>Edit Ticket</h2>

                    <form onSubmit={handleSaveEdit}>

                        <label>Title</label>

                        <input
                            type="text"
                            name="title"
                            value={editForm.title}
                            onChange={handleEditChange}
                            required
                        />

                        <label>Description</label>

                        <textarea
                            name="description"
                            value={editForm.description}
                            onChange={handleEditChange}
                            rows="5"
                            required
                        />

                        <label>Priority</label>

                        <select
                            name="priority"
                            value={editForm.priority}
                            onChange={handleEditChange}
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

                        <label>Category</label>

                        <select
                            name="categoryId"
                            value={editForm.categoryId}
                            onChange={handleEditChange}
                            required
                        >
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

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={savingEdit}
                        >
                            {savingEdit
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </form>
                </div>
            )}

            <div className="ticket-detail-grid">

                <div className="ticket-detail-main">

                    <div className="detail-card">

                        <h2>Ticket Information</h2>

                        <div className="detail-description">
                            {ticket.description}
                        </div>

                        <div className="detail-fields">

                            <div>
                                <span className="detail-label">
                                    Category
                                </span>

                                <strong>
                                    {ticket.category.name}
                                </strong>
                            </div>

                            <div>
                                <span className="detail-label">
                                    Priority
                                </span>

                                <span
                                    className={`priority-badge priority-${ticket.priority}`}
                                >
                                    {getPriorityName(
                                        ticket.priority
                                    )}
                                </span>
                            </div>

                            <div>
                                <span className="detail-label">
                                    Status
                                </span>

                                <span
                                    className={`status-badge status-${ticket.status}`}
                                >
                                    {getStatusName(
                                        ticket.status
                                    )}
                                </span>
                            </div>

                            <div>
                                <span className="detail-label">
                                    Assigned To
                                </span>

                                <strong>
                                    {ticket.assignedTo
                                        ? ticket.assignedTo.email
                                        : "Unassigned"}
                                </strong>
                            </div>

                            <div>
                                <span className="detail-label">
                                    Created
                                </span>

                                <strong>
                                    {new Date(
                                        ticket.createdAt
                                    ).toLocaleString()}
                                </strong>
                            </div>

                            <div>
                                <span className="detail-label">
                                    Last Updated
                                </span>

                                <strong>
                                    {ticket.updatedAt
                                        ? new Date(
                                            ticket.updatedAt
                                        ).toLocaleString()
                                        : "Never"}
                                </strong>
                            </div>

                        </div>
                    </div>

                    <div className="detail-card">

                        <h2>Comments</h2>

                        {ticket.comments.length === 0 ? (
                            <p className="muted-text">
                                No comments yet.
                            </p>
                        ) : (
                            <div className="comments-list">

                                {ticket.comments.map(
                                    (item) => (
                                        <div
                                            className="comment"
                                            key={
                                                item.commentId
                                            }
                                        >
                                            <div className="comment-header">
                                                <strong>
                                                    {item.user}
                                                </strong>

                                                <span>
                                                    {new Date(
                                                        item.createdAt
                                                    ).toLocaleString()}
                                                </span>
                                            </div>

                                            <p>
                                                {item.content}
                                            </p>
                                        </div>
                                    )
                                )}

                            </div>
                        )}

                        <form
                            className="comment-form"
                            onSubmit={handleAddComment}
                        >
                            <textarea
                                value={comment}
                                onChange={(event) =>
                                    setComment(
                                        event.target.value
                                    )
                                }
                                placeholder="Write a comment..."
                                rows="4"
                            />

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={
                                    addingComment ||
                                    !comment.trim()
                                }
                            >
                                {addingComment
                                    ? "Adding..."
                                    : "Add Comment"}
                            </button>
                        </form>

                    </div>

                </div>

                <div className="ticket-detail-sidebar">

                    <div className="detail-card">

                        <h2>Change Status</h2>

                        <select
                            value={newStatus}
                            onChange={(event) =>
                                setNewStatus(
                                    Number(event.target.value)
                                )
                            }
                        >
                            <option value={0}>
                                Open
                            </option>
                            <option value={1}>
                                In Progress
                            </option>
                            <option value={2}>
                                Resolved
                            </option>
                            <option value={3}>
                                Closed
                            </option>
                        </select>

                        <button
                            className="primary-button full-width"
                            onClick={handleStatusChange}
                            disabled={
                                savingStatus ||
                                Number(newStatus) ===
                                ticket.status
                            }
                        >
                            {savingStatus
                                ? "Updating..."
                                : "Update Status"}
                        </button>

                    </div>

                    {users.length > 0 && (
                        <div className="detail-card">

                            <h2>Assignment</h2>

                            <select
                                value={selectedUser}
                                onChange={(event) =>
                                    setSelectedUser(
                                        Number(
                                            event.target.value
                                        )
                                    )
                                }
                            >
                                <option value="">
                                    Select user
                                </option>

                                {users.map((user) => (
                                    <option
                                        key={user.userId}
                                        value={user.userId}
                                    >
                                        {user.firstName}{" "}
                                        {user.lastName} —{" "}
                                        {user.role}
                                    </option>
                                ))}
                            </select>

                            <button
                                className="primary-button full-width"
                                onClick={handleAssignment}
                                disabled={
                                    assigning ||
                                    !selectedUser
                                }
                            >
                                {assigning
                                    ? "Assigning..."
                                    : "Assign Ticket"}
                            </button>

                        </div>
                    )}

                    <div className="detail-card">

                        <h2>Status History</h2>

                        {ticket.history.length === 0 ? (
                            <p className="muted-text">
                                No status changes yet.
                            </p>
                        ) : (
                            <div className="history-list">

                                {ticket.history.map(
                                    (item) => (
                                        <div
                                            className="history-item"
                                            key={
                                                item.ticketHistoryId
                                            }
                                        >
                                            <strong>
                                                {item.oldStatus ===
                                                    null
                                                    ? "Created"
                                                    : getStatusName(
                                                        item.oldStatus
                                                    )}{" "}
                                                ?{" "}
                                                {getStatusName(
                                                    item.newStatus
                                                )}
                                            </strong>

                                            <span>
                                                {
                                                    item.changedBy
                                                }
                                            </span>

                                            <small>
                                                {new Date(
                                                    item.changedAt
                                                ).toLocaleString()}
                                            </small>
                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </div>

                </div>

            </div>
        </div>
    );
}

export default TicketDetails;