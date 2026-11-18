# Database Schema and Migrations

This folder contains the database definitions, constraints, indexes, and initial seed scripts for the **IEM Admission Management System**.

---

## 📁 Directory Structure

```
database/
├── schema/
│   ├── 001_create_tables.sql         # Relational schema (Users, Applicants, Applications, Docs, Ledger)
│   └── 002_constraints_indexes.sql   # Performance indexes & foreign key constraints
├── seed/
│   ├── 001_seed_data.sql             # SQL seed queries
│   └── seed.js                       # MongoDB / Mongoose collections seeder
└── README.md
```

---

## 🚀 Running Migrations

### MySQL / Relational Database
1. Create and configure your database:
   ```bash
   mysql -u root -p < schema/001_create_tables.sql
   mysql -u root -p < schema/002_constraints_indexes.sql
   ```
2. Insert mock applicant records:
   ```bash
   mysql -u root -p < seed/001_seed_data.sql
   ```

### MongoDB Seeding
To populate MongoDB with sample candidates, run from `backend/`:
```bash
npm run seed
```

