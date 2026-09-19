const API_URL = "https://localhost:7033/api";

function getToken() {
    return localStorage.getItem("token");
}

export async function login(email, password) {
    const response = await fetch(`${API_URL}/Auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed.");
    }

    return data;
}

export async function getTickets() {
    const token = getToken();

    const response = await fetch(`${API_URL}/Tickets`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to load tickets.");
    }

    return response.json();
}
export async function getTicketById(id) {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/Tickets/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to load ticket."
        );
    }

    return data;
}
export async function changeTicketStatus(id, status) {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/Tickets/${id}/status`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                status
            })
        }
    );

    if (!response.ok) {
        const data = await response.json();

        throw new Error(
            data.message || "Failed to change ticket status."
        );
    }
}
export async function addTicketComment(id, content) {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/Tickets/${id}/comments`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                content
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to add comment."
        );
    }

    return data;
}
export async function updateTicket(id, ticket) {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/Tickets/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(ticket)
        }
    );

    if (!response.ok) {
        const data = await response.json();

        throw new Error(
            data.message || "Failed to update ticket."
        );
    }
}
export async function assignTicket(id, userId) {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/Tickets/${id}/assign`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                userId
            })
        }
    );

    if (!response.ok) {
        const data = await response.json();

        throw new Error(
            data.message || "Failed to assign ticket."
        );
    }
}

export async function getUsers() {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/Users`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to load users."
        );
    }

    return data;
}
export async function getCategories() {
    const token = getToken();

    const response = await fetch(`${API_URL}/Category`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to load categories.");
    }

    return response.json();
}

export async function createTicket(ticket) {
    const token = getToken();

    const response = await fetch(`${API_URL}/Tickets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(ticket)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to create ticket."
        );
    }

    return data;
}