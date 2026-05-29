# Portfolio Website - Aditi Shrimankar

A modern, full-stack portfolio website showcasing projects, skills, achievements, and professional experience.

**Live Website:** [https://aditishrimankar.com](https://aditishrimankar.com)

## Tech Stack

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database (MongoDB Atlas)
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Services
- **Supabase** - File storage (images, videos, documents)
- **Resend** - Email service (contact form)
- **Render** - Backend hosting
- **cPanel** - Frontend hosting

## Features

### Public Features
- **Home Section** - Professional introduction with profile photo
- **Skills Section** - Categorized technical skills with proficiency levels
  - Languages, Frontend, Backend, Databases, Tools, AI & Data Science
- **Projects Section** - Categorized project showcase
  - AI Engineer
  - Data Science Enthusiast
  - Full-Stack Developer
- **Achievements Section** - Awards and certifications with copyright protection
- **Contact Form** - Professional email integration with auto-responses
- **Resume Download** - Direct resume download from sidebar
- **Dark/Light Theme** - Theme toggle
- **Responsive Design** - Mobile-friendly interface

### Admin Features
- **Dashboard** - Analytics and management overview
- **Project Management** - Add, edit, delete projects with media upload
- **Skills Management** - Manage skills with icons and categories
- **Achievement Management** - Add achievements with certificate images
- **Resume Management** - Upload and update resume
- **About Section Management** - Update profile information

## Project Structure

```
FUTURE_FS_01/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── views/           # Page components
│   │   ├── context/         # React context (Auth, Theme)
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   └── dist/                # Production build
├── src/                     # Backend source
│   ├── controllers/         # Route controllers
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   └── utils/               # Backend utilities
└── package.json             # Backend dependencies
```

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
INIT_ADMIN_EMAIL=your_admin_email
INIT_ADMIN_PASSWORD=your_admin_password
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
SUPABASE_STORAGE_BUCKET=media
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@aditishrimankar.com
ADMIN_EMAIL=aditi1411ss@gmail.com
FRONTEND_URL=https://aditishrimankar.com
ALLOWED_ORIGINS=https://aditishrimankar.com,https://www.aditishrimankar.com
```

### Frontend (.env)
```
VITE_API_BASE_URL=https://future-fs-01-backend-7jvt.onrender.com/api
VITE_BACKEND_URL=https://future-fs-01-backend-7jvt.onrender.com
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Supabase account
- Resend account

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/Adittii72/FUTURE_FS_01.git
cd FUTURE_FS_01
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
```

4. **Set up environment variables**
- Copy `.env.example` to `.env` in root directory
- Copy `frontend/.env.example` to `frontend/.env`
- Fill in all required values

5. **Run backend**
```bash
npm start
```

6. **Run frontend (in another terminal)**
```bash
cd frontend
npm run dev
```

## Deployment

### Backend (Render)
- Connected to GitHub repository
- Auto-deploys on push to main branch
- Environment variables configured in Render dashboard

### Frontend (cPanel)
1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Upload contents of `frontend/dist/` to cPanel `public_html/`
3. Ensure `.htaccess` file is present for routing

## API Endpoints

### Public Routes
- `GET /api/about` - Get about information
- `GET /api/skills` - Get all skills
- `GET /api/projects` - Get all projects
- `GET /api/achievements` - Get all achievements
- `POST /api/contact` - Submit contact form
- `GET /api/resume` - Get resume download link

### Admin Routes (Protected)
- `POST /api/admin/login` - Admin login
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/skills` - Create skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill
- `POST /api/achievements` - Create achievement
- `PUT /api/achievements/:id` - Update achievement
- `DELETE /api/achievements/:id` - Delete achievement
- `POST /api/resume/upload` - Upload resume
- `PUT /api/about` - Update about section

## Features in Detail

### Email System
- **Contact Form**: Sends professional emails to admin
- **Auto-Response**: Users receive thank you email
- **Custom Domain**: Emails sent from noreply@aditishrimankar.com
- **Professional Templates**: HTML email templates with branding

### File Storage
- **Supabase Storage**: Cloud storage for all media files
- **Supported Formats**: Images (JPG, PNG, GIF), Videos (MP4), Documents (PDF)
- **Automatic URL Generation**: Media URLs generated automatically

### Authentication
- **JWT-based**: Secure token-based authentication
- **Protected Routes**: Admin routes require authentication
- **Session Management**: Persistent login with localStorage

### Theme System
- **Dark/Light Mode**: Toggle between themes
- **Persistent Preference**: Theme choice saved in localStorage
- **Smooth Transitions**: Animated theme switching

## Color Scheme

- **Primary**: #00d4ff (Cyan)
- **Secondary**: #0099ff (Blue)
- **Dark Background**: #1a1f3a
- **Darker Background**: #252b4a

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is private and proprietary.

## Contact

**Aditi Shrimankar**
- Website: [https://aditishrimankar.com](https://aditishrimankar.com)
- Email: aditi1411ss@gmail.com
- GitHub: [https://github.com/Adittii72](https://github.com/Adittii72)

---

Built with ❤️ by Aditi Shrimankar
