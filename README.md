# 📝 ThinkBoard - Smart Note Taking & Task Management App

<div align="center">

**A full-stack note-taking and task management application with file attachments, status tracking, and a beautiful media library—all with real-time Cloudinary integration and multiple theme support.**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![MERN](https://img.shields.io/badge/MERN-Stack-brightgreen)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Docs](#-api-documentation)

</div>

---

## 🎯 Features

### 📌 Core Features

- ✅ **Create, Read, Update, Delete Notes** - Full CRUD operations with rich text editor (React Quill)
- ✅ **Task Status Tracking** - Mark notes as: To Study, Currently Learning, Completed
- ✅ **Favorites System** - Star your important notes for quick access
- ✅ **Tag Organization** - Add multiple tags per note for better organization
- ✅ **File Attachments** - Upload images, PDFs, documents directly from Cloudinary
- ✅ **Media Library** - Dedicated page to browse all uploaded files with search & filter
- ✅ **Real-time Search** - Instantly find notes by title, content, or tags

### 🎨 UI/UX Features

- 🌓 **Multiple Themes** - Light, Dark, and Noir modes with smooth transitions
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- ⚡ **Smooth Animations** - Interactive hover effects and transitions
- 🖼️ **Image Gallery** - Thumbnail preview with modal view for images
- 📎 **File Organization** - Organized by type (Images, Documents, Media)

### 🔒 Security & Performance

- 🔐 **JWT Authentication** - Secure user authentication with cookie storage
- 🛡️ **Protected Routes** - Role-based access control (User & Admin)
- ⏱️ **Rate Limiting** - Redis-based rate limiting to prevent abuse
- ☁️ **Cloud Storage** - Secure file storage with Cloudinary
- 🔄 **Admin Override** - Demo admin (user@example.com) can view all notes

---

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library with hooks
- **Vite** - Fast build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Tailwind component library
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **React Quill** - Rich text editor
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

### Backend

- **Node.js & Express** - Server runtime & framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Authentication
- **Bcryptjs** - Password hashing
- **Cloudinary** - Cloud file storage
- **Multer** - File upload middleware
- **Upstash Redis** - Rate limiting & caching

---

## 📁 Project Structure

```
mern-thinkboard-master/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.js      # Cloudinary setup
│   │   │   ├── db.js              # MongoDB connection
│   │   │   ├── env.js             # Environment config (loads .env)
│   │   │   └── upstash.js         # Redis config
│   │   ├── controllers/
│   │   │   ├── authController.js  # Auth logic
│   │   │   ├── notesController.js # Notes CRUD + getAllMedia
│   │   │   └── uploadController.js # File upload
│   │   ├── models/
│   │   │   ├── User.js            # User schema
│   │   │   └── Note.js            # Note schema with attachments
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js  # JWT verification
│   │   │   ├── rateLimiter.js     # Redis rate limiting
│   │   │   └── uploadMiddleware.js # Multer config
│   │   ├── routes/
│   │   │   ├── authRoutes.js      # Auth endpoints
│   │   │   └── notesRoutes.js     # Notes endpoints + /media/all
│   │   ├── utils/
│   │   │   └── cloudinaryHelper.js # Cloudinary upload logic
│   │   └── server.js              # Express setup & startup
│   ├── .env                       # Environment variables
│   └── package.json

├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx              # Dashboard (Kanban view)
│   │   │   ├── CreatePage.jsx            # Create new note
│   │   │   ├── NoteDetailPage.jsx        # View/edit note
│   │   │   ├── MediaLibraryPage.jsx      # Media gallery & search
│   │   │   ├── LoginPage.jsx             # Login form
│   │   │   └── RegisterPage.jsx          # Registration form
│   │   ├── components/
│   │   │   ├── Navbar.jsx                # Top navigation bar
│   │   │   ├── KanbanColumn.jsx          # Status column in dashboard
│   │   │   ├── NoteCard.jsx              # Note preview card
│   │   │   ├── RateLimitedUI.jsx         # Rate limit message
│   │   │   ├── NotesNotFound.jsx         # Empty state
│   │   │   └── AttachmentGallery.jsx     # Image & file gallery
│   │   ├── store/
│   │   │   ├── useAuthStore.js           # Auth state
│   │   │   ├── useSearchStore.js         # Search state
│   │   │   └── useThemeStore.js          # Theme state
│   │   ├── lib/
│   │   │   ├── axios.js                  # Axios instance
│   │   │   └── utils.js                  # Helper functions
│   │   ├── App.jsx                       # Routes setup
│   │   ├── index.css                     # Global styles
│   │   └── main.jsx                      # Entry point
│   ├── tailwind.config.js          # Tailwind config with 3 themes
│   ├── vite.config.js              # Vite config
│   ├── eslint.config.js            # ESLint config
│   └── package.json

├── CLOUDINARY_SETUP.md             # Cloudinary setup guide
└── README.md                       # This file
```

---

## ⚙️ Installation

### Prerequisites

- Node.js 16+ and npm
- MongoDB (local or cloud)
- Cloudinary account (for file uploads)
- Upstash Redis account (for rate limiting)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/mern-thinkboard.git
cd mern-thinkboard-master
```

### Step 2: Setup Backend

```bash
cd backend
npm install
```

### Step 3: Setup Frontend

```bash
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

### Backend - Create `.env` in `/backend`

```env
# MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/thinkboard

# Environment
NODE_ENV=development

# JWT
JWT_SECRET=super_secret_thinkboard_key_123

# Cloudinary (get from https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Upstash Redis (get from https://console.upstash.com)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

**Important Notes:**

- ✅ Dotenv is loaded at the **very start** of server.js before any imports
- ✅ The `.env` file must be in `/backend` root directory
- ✅ For development, you can use local MongoDB: `mongodb://127.0.0.1:27017/thinkboard`

---

## 🚀 Running the Application

### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
# Server runs on http://localhost:5001
```

### Terminal 2: Start Frontend Dev Server

```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Default Demo Account

```
Email: user@example.com
Password: password@123
```

---

## 📖 Usage

### Creating a Note

1. Click **"+ New Note"** button in navbar
2. Enter title and content (with rich text editor)
3. Add tags (press Enter to add)
4. Select status (To Study, Learning, Completed)
5. Upload files/images (optional)
6. Click **"✅ Create Note"**

### Viewing Notes

- **Dashboard**: Kanban board view with columns for each status
- **Search**: Use search bar to find notes by title
- **Favorites**: Star notes for quick access

### Managing Files

1. Go to **"📁 Media"** in navbar
2. Browse all uploaded files organized by type
3. Filter: All Files, Images, Documents, Videos
4. Search by filename or note name
5. Download or view any file
6. Click note name to jump to source note

### Switching Themes

- Click the **☀️/🌙** button in navbar
- Cycles through: Light → Dark → Noir

---

## 🔗 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
POST   /api/auth/logout       - Logout user
GET    /api/auth/check        - Check if authenticated
```

### Notes Endpoints

```
GET    /api/notes             - Get all user notes
GET    /api/notes/media/all   - Get all media with note info
GET    /api/notes/:id         - Get single note
POST   /api/notes             - Create new note
PUT    /api/notes/:id         - Update note
DELETE /api/notes/:id         - Delete note
POST   /api/notes/upload      - Upload files to Cloudinary
PUT    /api/notes/:id/favorite - Toggle favorite status
```

### Request/Response Examples

#### Create Note

**Happy Note Taking! 🎉**
