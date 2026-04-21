# UserHub

React project configured with **Vite** and **TailwindCSS**.

---

## Technologies Used

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)

---

## Prerequisites

Before starting, please ensure the following are installed on your machine:

- Node.js (recommended version: 18 or higher)
- npm (included with Node.js)

---

### Checking Node.js

To check if Node.js is installed, open a terminal and type:

```bash
node -v
```

If a version is displayed (e.g. `v18.17.1`), then Node.js is successfully installed.

---

### If Node.js is not installed:

1. Go to the official website:  
   https://nodejs.org/

2. Download the **LTS version (recommended)** for your system (Windows, macOS, Linux).

3. Follow the installation instructions.

4. Once the installation is complete, check again with:

```bash
node -v
```

---

## Frontend Installation Steps (React + Vite)

### 1. Clone this repository

```bash
git clone https://github.com/<YOUR-USERNAME>/UserHub.git
cd UserHub
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install -f
```

### 3. Start the development server (frontend)

```bash
npm run dev
```

### 4. Access the application

Open your browser to the following address:

```
http://localhost:5173
```

---

### Backend Installation

1. Go to the `backend` folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in `backend/`:

```
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/gestionProfils_db?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
ZERUH_API_KEY=your_zeruh_api_key
```

Replace the `<...>` and placeholder values with your MongoDB Atlas connection and API details.

4. Start the server:

```bash
node server.js
```

You should see:

```
Serveur Express a démarré sur http://localhost:3000
Connexion à MongoDB réussie !
```

---

## Run the Complete Project

1. Terminal 1 – Backend:

```bash
cd backend
node server.js
```

2. Terminal 2 – Frontend:

```bash
cd frontend
npm run dev
```

---

## Expected Result

- Web Interface: http://localhost:5173
- Express API: http://localhost:3000

The REST API offers the following routes:

- `POST /profils` — create a new user
- `GET /profils/:id` — read a user
- `PUT /profils/:id` — update a user
- `DELETE /profils/:id` — delete a user
- `GET /profils` — read all users (admin only)
- `GET /motdepasse/:longueur` — generate a random password

---

## Security

- Passwords are **hashed with bcrypt** before being stored.
- The Express server is configured to read JSON data securely.
- An external API is used to **validate emails**.
- JWT authentication is implemented to secure REST routes.

---
