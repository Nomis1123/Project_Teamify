
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


<img width="958.5" height="462.5" alt="image" src="https://github.com/user-attachments/assets/01d68cd8-6c85-49ed-94b1-66bddfffd3fe" />

