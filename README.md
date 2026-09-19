# HelpDesk — Issue & Support Ticket Management System

A full-stack issue and support ticket management system built with **ASP.NET Core Web API** and **React**.

The application allows users to create and manage support tickets, track ticket status, communicate through comments, assign tickets to staff members, and maintain a history of status changes.

## Features

* 🔐 JWT-based authentication
* 👤 Role-based authorization

  * Admin
  * Manager
  * Employee
* 🎫 Create and view support tickets
* ✏️ Edit ticket information
* 🗑️ Delete tickets
* 👥 Assign tickets to users
* 🔄 Change ticket status
* 💬 Add comments to tickets
* 📋 Ticket status history
* 🏷️ Ticket categories
* ⚡ Ticket priority levels
* 📊 Dashboard with ticket statistics
* 🔎 Detailed ticket view
* 📱 Responsive frontend
* 🗄️ SQLite database with Entity Framework Core
* 🔒 Password hashing with PBKDF2
* 📖 Swagger/OpenAPI API documentation

## Tech Stack

### Backend

* C#
* ASP.NET Core Web API
* Entity Framework Core
* SQLite
* JWT Authentication
* Swagger / OpenAPI
* REST API

### Frontend

* React
* JavaScript
* Vite
* HTML5
* CSS3

### Development Tools

* Visual Studio / VS Code
* Git
* GitHub
* SQL / SQLite
* Entity Framework Core Migrations

## Architecture

The backend follows a layered architecture:

```text
HelpDesk
│
├── HelpDesk.Application
│   ├── DTOs
│   ├── Interfaces
│   └── Services
│
├── HelpDesk.Domain
│   ├── Entities
│   └── Enums
│
├── HelpDesk.Infrastructure
│   ├── Data
│   ├── EntityConfiguration
│   ├── Migrations
│   ├── Seed
│   └── Services
│
└── WebApplication1
    ├── Controllers
    ├── Program.cs
    └── Configuration
```

The frontend is separated from the backend:

```text
helpdesk-frontend
│
├── src
│   ├── api
│   ├── components
│   └── pages
│
├── public
└── package.json
```

## Authentication & Authorization

The API uses **JWT bearer authentication**.

After logging in, the API returns a JWT containing the user's identity and role.

Authorization is applied to protected endpoints based on the user's role.

For example:

| Operation                 | Employee | Manager | Admin |
| ------------------------- | :------: | :-----: | :---: |
| View tickets              |     ✅    |    ✅    |   ✅   |
| Create tickets            |     ✅    |    ✅    |   ✅   |
| Change status             |     ✅    |    ✅    |   ✅   |
| Add comments              |     ✅    |    ✅    |   ✅   |
| Edit tickets              |     ❌    |    ✅    |   ✅   |
| Delete tickets            |     ❌    |    ✅    |   ✅   |
| Assign tickets            |     ❌    |    ✅    |   ✅   |
| Create categories         |     ❌    |    ✅    |   ✅   |
| View users for assignment |     ❌    |    ✅    |   ✅   |

## Ticket Workflow

Tickets can move through the following statuses:

```text
Open
  ↓
In Progress
  ↓
Resolved
  ↓
Closed
```

Every status change is recorded in the ticket history together with the user who made the change and the timestamp.

## Database

The project uses **SQLite** with **Entity Framework Core**.

Main entities include:

* User
* Role
* Ticket
* Category
* Comment
* TicketHistory

Relationships include:

```text
Role
 │
 └── Users
      │
      ├── Created Tickets
      ├── Assigned Tickets
      └── Comments

Category
 │
 └── Tickets
      │
      ├── Comments
      └── Ticket History
```

Database schema changes are managed using Entity Framework Core migrations.

## API Endpoints

### Authentication

```text
POST /api/Auth/register
POST /api/Auth/login
```

### Tickets

```text
GET    /api/Tickets
GET    /api/Tickets/{id}
POST   /api/Tickets
PUT    /api/Tickets/{id}
DELETE /api/Tickets/{id}

PUT    /api/Tickets/{id}/assign
PUT    /api/Tickets/{id}/status

POST   /api/Tickets/{id}/comments
```

### Categories

```text
GET  /api/Category
POST /api/Category
```

### Users

```text
GET /api/Users
```

## Running the Project Locally

### Requirements

Make sure you have installed:

* .NET SDK 8 or later
* Node.js
* npm
* Git

### 1. Clone the repository

```bash
git clone https://github.com/little-medic/HelpDesk.git
cd HelpDesk
```

### 2. Start the backend

Navigate to the API project:

```bash
cd HelpDesk/WebApplication1
```

Restore dependencies:

```bash
dotnet restore
```

Apply the database migrations:

```bash
dotnet ef database update
```

Start the API:

```bash
dotnet run
```

The API runs locally on:

```text
https://localhost:7033
```

Swagger documentation is available at:

```text
https://localhost:7033/swagger
```

### 3. Start the React frontend

Open a second terminal:

```bash
cd HelpDesk/helpdesk-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5175
```

## Example Login

For local development, the project includes a seeded administrator account.

```text
Email:    admin@test.com
Password: Admin123!
```

> This account is intended only for local development and demonstration.

## Project Goals

This project was built to demonstrate practical full-stack development skills, including:

* REST API development
* Clean separation between application layers
* Database design and relationships
* Entity Framework Core
* Authentication and authorization
* Role-based access control
* CRUD operations
* API consumption from React
* State management and frontend navigation
* Form handling
* Error handling
* Git and GitHub workflow

## Future Improvements

Potential future improvements include:

* Automated tests
* Pagination and advanced ticket filtering
* Search functionality
* File attachments
* Email notifications
* User profile management
* Admin dashboard
* Audit logging
* Docker support
* Production database configuration
* CI/CD pipeline

## License

This project is available for portfolio and educational purposes.
