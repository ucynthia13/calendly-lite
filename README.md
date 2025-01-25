# Calendly-like App

A feature-rich scheduling application inspired by **Calendly**, designed to simplify scheduling meetings and events. This app utilizes **Neon** as the database for efficient and scalable data management.

---

## 🚀 Features

- **User Management**: Register, login, and manage user accounts (Credits to **Clerk** for the Simplified and Secure Auth).
- **Event Scheduling**: Create, customize, and share events with invitees.
- **Availability Management**: Set and manage availability to prevent conflicts.
- **Automated Notifications**: Send reminders and notifications for scheduled events.
- **Integration**: Sync with Google Calendar as for now.
- **Customizable Time Zones**: Handle scheduling across multiple time zones.
- **Secure Storage**: User credentials and sensitive data are securely stored.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js with TailwindCSS for a modern and responsive UI.
- **Backend**: 
  - **Next.js** for API routes and server-side logic
  - **Drizzle ORM** for database (Neon)
  - **Zod** for schema validation
  - **Google Calendar API** for event management
  - **Date-fns-tz** for timezone handling
- **Deployment**: Hosted on Vercel

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Neon account for database setup
- Clerk account for authentication purposes

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ucynthia13/calendly-like.git
   cd calendly-like-app

2. Install dependencies
    npm install

3. Set up the Neon database and add the connection string to **backend/.env**

4. Start the app: 
    npm start

