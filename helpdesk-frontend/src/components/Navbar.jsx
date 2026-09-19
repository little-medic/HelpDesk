function Navbar({ onLogout, onNavigate }) {
    return (
        <nav className="navbar">
            <div
                className="navbar-brand"
                onClick={() => onNavigate("dashboard")}
            >
                HelpDesk
            </div>

            <div className="navbar-links">
                <button
                    onClick={() => onNavigate("dashboard")}
                >
                    Dashboard
                </button>

                <button
                    onClick={() => onNavigate("tickets")}
                >
                    Tickets
                </button>

                <button
                    className="logout-button"
                    onClick={onLogout}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;