# IEM Admission Management System

A comprehensive Admission & Counseling Portal for the **Institute of Engineering & Management (IEM)**.

---

## 🏗️ Project Architecture & Folder Structure

```
IEM/
├── backend/                      # Express & Node.js Backend API
│   ├── src/                     # All Backend Source Code
│   │   ├── config/              # Configuration (env.js, mongo.js, multer.js)
│   │   ├── constants/           # Status codes, roles, courses
│   │   ├── controllers/         # Request handlers (auth, applicant, admin, payment)
│   │   ├── middleware/          # JWT auth, multer upload, error handler
│   │   ├── models/              # Mongoose schemas (Applicant, Transaction, User)
│   │   ├── routes/              # Express API route endpoints
│   │   ├── services/            # Business & database logic
│   │   ├── tests/               # Test suites
│   │   ├── utils/               # Phone validation, responses, logger
│   │   ├── validators/          # Input validation logic
│   │   ├── app.js               # Express application initialization
│   │   └── server.js            # Server entry point
│   ├── uploads/                 # Uploaded applicant documents & photos
│   ├── .env                     # Environment variables
│   ├── .env.example             # Example environment configuration
│   ├── .eslintrc.json           # Linter rules
│   ├── .prettierrc              # Formatter rules
│   ├── package.json             # Backend dependencies & scripts
│   └── package-lock.json
│
├── database/                     # Relational & NoSQL Database Schemas
│   ├── schema/
│   │   ├── 001_create_tables.sql
│   │   └── 002_constraints_indexes.sql
│   ├── seed/
│   │   ├── 001_seed_data.sql
│   │   └── seed.js              # MongoDB seed script
│   └── README.md
│
├── frontend/                     # Client Web Application
│   ├── assets/                  # Branding and campus assets
│   ├── app.js                   # Client Controller
│   ├── index.html               # Main UI Views & Modals
│   └── style.css                # Styling
│
├── run.bat                       # One-click Windows Launcher
└── package.json                  # Root runner scripts
```

---

## ⚡ Quick Start

### Start Server
Run the batch script:
```cmd
run.bat
```
Or with npm from the root:
```bash
npm start
```

Access the portal in your browser at:
```
http://localhost:5000
```

