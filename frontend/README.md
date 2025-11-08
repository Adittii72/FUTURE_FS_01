# Personal Portfolio Website

A modern, full-featured personal portfolio website with integrated admin functionality. Built with React, Tailwind CSS, and featuring a beautiful light/dark mode theme.

## Features

### Public Portfolio
- **Hero/About Section**: Showcase your headline, bio, and cover image
- **Skills Section**: Display your skills with proficiency percentages in a beautiful grid
- **Projects Section**: Showcase your projects with images/videos, descriptions, and tech stacks
- **Achievements Section**: Highlight your accomplishments and awards
- **Contact Form**: Allow visitors to send you messages
- **Responsive Design**: Fully responsive across all devices
- **Light/Dark Mode**: Beautiful theme toggle with smooth transitions

### Admin Features
- **Integrated Admin Controls**: Edit buttons appear when logged in as admin
- **Dashboard**: View analytics and manage contact messages
- **Content Management**: Full CRUD operations for:
  - About section
  - Skills
  - Projects (with media upload)
  - Achievements
  - Resume download link
- **Secure Authentication**: JWT-based authentication with protected routes

## Technology Stack

- **React 18** - Modern React with Hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library
- **Vite** - Fast build tool and dev server

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific modals
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Header.jsx
│   ├── Input.jsx
│   ├── Modal.jsx
│   └── Textarea.jsx
├── context/            # React Context providers
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── services/           # API services
│   └── api.js
├── views/             # Page components
│   ├── About.jsx
│   ├── Achievements.jsx
│   ├── Contact.jsx
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── Projects.jsx
│   └── Skills.jsx
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## API Endpoints

The application expects the following API endpoints:

### Public Endpoints
- `GET /api/about` - Get about section data
- `GET /api/skills` - Get all skills
- `GET /api/projects` - Get all projects
- `GET /api/achievements` - Get all achievements
- `GET /api/resume` - Get resume URL
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Require Authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/analytics/summary` - Get dashboard statistics
- `GET /api/contact/messages` - Get all contact messages
- `DELETE /api/contact/:id` - Delete a message
- `PUT /api/about` - Update about section
- `POST /api/skills` - Create skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/upload/:id` - Upload project media
- `POST /api/achievements` - Create achievement
- `PUT /api/achievements/:id` - Update achievement
- `DELETE /api/achievements/:id` - Delete achievement
- `POST /api/resume` - Update resume URL

## Authentication

The app uses JWT tokens stored in localStorage. When an admin logs in:
1. Token is saved to localStorage
2. Token is automatically attached to all API requests via axios interceptor
3. Edit controls appear on public pages
4. Access to `/dashboard` is protected

## Styling

The app uses Tailwind CSS with:
- Custom gradient themes
- Smooth animations and transitions
- Responsive design utilities
- Dark mode support

Custom styles are defined in `src/index.css` with Tailwind directives.

## License

MIT

