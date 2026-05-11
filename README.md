
# Project Teamify


<img width="934" height="375" alt="image" src="https://github.com/user-attachments/assets/065d8e99-4c4d-409d-a2f6-8ce6d468960b" />


# Introduction
A production-ready web application designed to solve the structural frustrations of solo-queue gaming. 

Built with a React frontend and a multi-language backend (Node.js/Python), Teamify bypasses the chaos of traditional LFG forums. 

It features real-time bi-directional chat via WebSockets, Steam API integration for library verification, and a proprietary 3x7 availability grid that dynamically filters and pairs users with overlapping schedules. 

The platform is deployed via a fully automated CI/CD pipeline and engineered with strict WCAG accessibility standards.


## Features


- Bypasses opaque matchmaking algorithms by allowing players to define their exact weekly schedules. The backend calculates compatibility scores to ensure users only match with genuinely available teammates.

- Engineered using Socket.io to provide instant, bi-directional messaging and dynamic UI state updates (like unread badges) without requiring page reloads.

- Seamlessly syncs a user's verified Steam game library directly to their public profile, verifying game ownership and eliminating manual data entry.

- Advanced search mechanics that allow users to filter potential teammates not just by game, but by competitive rank and preferred in-game role.

- A custom GitHub Actions workflow that listens to the dev branch and triggers a secure webhook to the live VPS, automatically pulling code and restarting the server via PM2 for zero-downtime updates.

- Designed with complete keyboard navigability, high-contrast dark mode aesthetics, and purely visual feedback loops to ensure an equitable experience for users with motor, visual, or hearing impairments.


<table width="100%">
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/546c30c6-e017-40a0-ae12-a598257215ef" alt="Feature 1" width="100%" />
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/01d68cd8-6c85-49ed-94b1-66bddfffd3fe" alt="Feature 2" width="100%" />
    </td>
  </tr>
  
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/42edbc2d-4dba-4e72-81ff-66cb8a1c74a3" alt="Feature 3" width="100%" />
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/906a3179-2170-4570-97af-0f979abc1bbb" alt="Feature 4" width="100%" />
    </td>
  </tr>

  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/64ae2cb3-fcae-4c4a-87ba-934cbb40ebfc" alt="Feature 5" width="100%" />
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/760da508-17c3-421e-9147-c179abac86e7" alt="Feature 6" width="100%" />
    </td>
  </tr>
</table>
## Installation

Follow these steps to get Teamify running on your own machine.

**Prequisites:**
- [Node.js & npm v16+](https://nodejs.org/)
- [Python v3.8+](https://www.python.org/downloads/)
- [PostgreSQL](https://www.postgresql.org/download/)
- Git

**1. Clone the repository**
```bash
git clone https://github.com/Nomis1123/Project_Teamify.git
cd Project_Teamify
```

**2. Configure environment variables**

Copy the example env file and fill in your values:
```bash
cp .env.example backend/.env
```

Open `backend/.env` and set your PostgreSQL credentials and a JWT secret key:
```
DB_HOST=localhost
DB_NAME=teamify_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_PORT=5432
JWT_SECRET_KEY=your_secret_key
```

Make sure the PostgreSQL database exists:
```bash
psql -U postgres -c "CREATE DATABASE teamify_db;"
```

**3. Run the setup script**
```bash
chmod +x setup.sh
./setup.sh
```

This will install all dependencies and start both servers:
- Backend (Flask): `http://localhost:8000`
- Frontend (Vite): `http://localhost:5173`

Press `Ctrl+C` to stop both servers.

