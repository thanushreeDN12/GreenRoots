# GreenRoots 🌿

A full-stack reforestation platform featuring geotagged tree tracking, carbon impact calculators, live community activity, and verified donor photo galleries.

---

## 🚀 How to Run Locally

### 1. Prerequisites
- **Node.js**: v18 or higher ([Download Node.js](https://nodejs.org/))
- **MongoDB**: Either a local MongoDB instance (`mongodb://127.0.0.1:27017/greenroots`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster.

---

### 2. Environment Setup (.env)

Real `.env` files contain private credentials and are ignored by git for security (`.gitignore`). To run locally, create the `.env` file from the provided template:

#### Create `.env` in the root folder (or `server/.env`):
Create a file named `.env` in the root directory (or in `/server/.env`):

```env
# Port for the Node/Express server
PORT=5000

# MongoDB Connection String (use local or Atlas URI)
MONGO_URI=mongodb://127.0.0.1:27017/greenroots

# Secret key used for signing JWT tokens (choose any secure string)
JWT_SECRET=greenroots_local_secret_key_2026

# JWT token expiration time
JWT_EXPIRES_IN=7d
```

---

### 3. Install Dependencies

From the project root directory, install all packages:
```bash
npm install
```

---

### 4. (Optional) Seed Initial Database Data

If your database is completely empty and you want the 20 Indian programs, pre-verified tree photos, and dummy users:
```bash
node server/scripts/seed_database.js
```

---

### 5. Start the Application

You can start both the client and server using the workspace script:

```bash
# Build client and run the server
npm run dev
```

Or run the client and server in separate terminal tabs:

**Terminal 1 (Backend Server):**
```bash
cd server
npm install
npm run dev
```
*(Backend runs on `http://localhost:5000`)*

**Terminal 2 (Frontend Client):**
```bash
cd client
npm install
npm start
```
*(Frontend opens at `http://localhost:3000`)*

---


