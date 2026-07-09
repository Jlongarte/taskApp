# 🚀 Workspace & Kanban Task Manager

A modern, full-stack Task Management application featuring dynamic Workspaces and an interactive Kanban Board. This platform allows users to organize
high-level projects, track daily tasks using custom completion sliders, visualize progress with precise metrics, and manage their focus time via an integrated Pomodoro widget.

---

## 🌟 Key Features

### 📁 Workspace & Project Management
* **Dynamic Boards:** Create, edit, and delete customized project boards with color-coded tags.
* **Granular Task Assignment:** Seamlessly link tasks to specific boards or keep them unassigned for personal tasks.
* **Progress Tracking:** Interactive range sliders within workspace cards allow real-time adjustments, triggering confetti celebrations upon completion.

### 🎚️ Kanban Board Dashboard
* **Drag-and-Drop Workflow:** Intuitively move tasks across columns (`Pending`, `In Progress`, and `Completed`).
* **Visual Statistics:** Real-time percentage completion tracker calculates overall project progress dynamically.
* **Activity Log Sidebar:** Keeps a chronological timeline of recent user actions (creating, moving, or updating tasks).

### ⏳ Integrated Focus Tools
* **Pomodoro Widget:** Built-in productivity timer with fully integrated focus intervals connected directly to the user's activity history.

### 🔒 Secure Authentication & Profiles
* **Secure Auth Gateway:** JWT-based user authentication featuring input validation safeguards (prevents username and email duplicates).
* **Multimedia Profiles:** Custom avatar uploads and password management powered by `Multer` and `Bcrypt` secure hashing.

---

## 🛠️ Technology Stack

### Frontend (Client)
* **React 18** (Functional components, custom hooks, and context state architecture).
* **React Router DOM** (Single Page Application routing with 404 fallback routing).
* **Canvas-Confetti** (Interactive micro-interactions for goal milestones).
* **Pure CSS3** (Futuristic glassmorphic theme with smooth transitions).

### Backend (Server)
* **Node.js** & **Express** (REST API endpoints architecture).
* **MongoDB** & **Mongoose** (ODM modeling with strict indexing and schema pre-save triggers).
* **JSON Web Tokens (JWT)** (Secure stateless route protection middleware).
* **Multer** (Multipart form-data file stream buffering for avatar processing).

---

## 📡 API Endpoints Summary

### Authentication & Profiles
* `POST /users/register` - Create an account with an optional image upload (`multipart/form-data`).
* `POST /users/login` - Authenticate user and sign safe JWT.
* `GET /users/profile` - Fetch authenticated user credentials.
* `PUT /users/name` - Update public identity signature.
* `PUT /users/avatar` - Update profile picture on the fly.

### Tasks & Boards
* `GET /tasks` - Retrieve tasks belonging strictly to the logged-in user.
* `POST /tasks` - Create a task (accepts optional structural `board` reference).
* `PUT /tasks/:id` - Dynamic updates (status changes, comments, slider progress).
* `DELETE /tasks/:id` - Permanently remove task item from logs.
* `GET /boards` - Retrieve workspace collections.
* `POST /boards` - Provision new designated kanban canvas.

---

## 📝 License
This project is open-source and available under the MIT License.

---


## ⚙️ Project Structure

```text
├── BACKEND/
│   ├── src/
│   │   ├── controllers/      # Authentication, Task, and Workspace logic
│   │   ├── middlewares/      # Authorization guards and Multer storage setups
│   │   ├── models/           # Mongoose strict Schemas (User, Task, Board)
│   │   └── routes/           # Express endpoint routers mapping
│   ├── .env                  # Environment application secrets
│   ├── .gitignore            # Git exclusion definitions
│   ├── index.js              # Server bootstrapper & database connection
│   ├── package-lock.json
│   └── package.json
│
└── FRONTEND/
    ├── public/               # Static assets & web manifests
    ├── src/
    │   ├── components/       # TaskForm, Kanban Columns, Headers, Widgets
    │   ├── context/          # AuthContext global session handlers
    │   ├── hooks/            # usePomodoro productivity custom handlers
    │   ├── pages/            # Dashboard, Workspaces, Login, Register, NotFound
    │   ├── services/
    │   │   └── api.js        # Centralized HTTP Fetch abstraction layers
    │   ├── App.jsx           # Root application layout router
    │   ├── index.css         # Global design and theme configurations
    │   └── main.jsx          # DOM entry rendering script
    ├── eslint.config.js      # Linter rules configuration
    ├── index.html            # Main HTML document template
    ├── package-lock.json
    └── package.json

