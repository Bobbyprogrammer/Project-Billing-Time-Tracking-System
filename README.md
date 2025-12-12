# Project Billing & Time Tracking System

A full-stack application built with **Node.js, Express, MongoDB** (backend) and **Next.js + TypeScript + ShadCN UI** (frontend).

This system allows **Admins** to manage projects and time logs, while **Employees** can track their working hours using a Kanban-style drag & drop board.

## Tech Stack

### **Backend (Node.js + Express + MongoDB)**

- Express.js
- Mongoose
- JSON Web Token (JWT)
- Cookie-based authentication
- CORS
- bcryptjs
- dotenv

### **Frontend (Next.js + TypeScript)**

- Next.js 16 (App Router)
- TypeScript
- Axios
- ShadCN UI
- Tailwind CSS
- React DnD / SortableJS (Drag & Drop)

## Setup Instructions

### **Clone Repository**

```bash
git clone https://github.com/Bobbyprogrammer/Project-Billing-Time-Tracking-System

cd backend
npm install
create .env file
MONGO_URI="Your Mongodb URL"
PORT="Your Port"
NODE_ENV="Your Node Environment"
JWT_SECRET="Your JWT Secret Key"

run command in terminal
npm run server

Frontend Setup (Next.js + TypeScript)
cd frontend
npm install
NEXT_PUBLIC_API_URL=your backend api end point

npm run dev
```
