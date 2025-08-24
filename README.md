# Away Days

A modern web application for planning and organizing your time away with friends and experiences. Built with Next.js 15, React 19, TypeScript, and featuring a sleek UI with authentication.

## 🚀 Features

- **🔐 Authentication**: Secure user authentication with Google OAuth
- **🗃️ Database**: PostgreSQL database with Drizzle ORM
- **🎨 Modern UI**: Beautiful, responsive design with Tailwind CSS and shadcn/ui components
- **👥 Friend Management**: Add and manage your friends
- **📅 Experience Tracking**: Plan and track your away days and experiences
- **📱 Responsive Design**: Mobile-first approach that works on all devices
- **⚡ Modern Stack**: Built with the latest technologies

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher ([Download here](https://nodejs.org/))
- **Git**: For cloning the repository ([Download here](https://git-scm.com/))
- **PostgreSQL**: Either locally installed or access to a hosted service

## 🛠️ Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Ehsaan75/Away-Days.git
cd Away-Days
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory and add your environment variables:

```env
# Database
POSTGRES_URL="postgresql://username:password@localhost:5432/your_database_name"

# Authentication - Better Auth
BETTER_AUTH_SECRET="your-random-32-character-secret-key-here"

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# App URL (for production deployments)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup

Generate and run database migrations:

```bash
npm run db:generate
npm run db:migrate
```

### 5. Start the Development Server

```bash
npm run dev
```

Your application will be available at [http://localhost:3000](http://localhost:3000)

## ⚙️ Service Configuration

### PostgreSQL Database

For development, you can use a local PostgreSQL instance or a cloud service like:
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
4. Set application type to **Web application**
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy the **Client ID** and **Client Secret** to your `.env` file

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── experiences/   # Experience management
│   │   └── friends/       # Friend management
│   ├── add-experience/    # Add experience page
│   ├── edit-experience/   # Edit experience page
│   ├── friends/           # Friends management page
│   ├── dashboard/         # User dashboard
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Other components
└── lib/                  # Utilities and configurations
    ├── auth.ts           # Authentication configuration
    ├── db.ts             # Database connection
    ├── schema.ts         # Database schema
    └── utils.ts          # General utilities
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run db:dev       # Push schema for development
npm run db:reset     # Reset database (drop all tables)
```

## 📖 Pages Overview

- **Home (`/`)**: Landing page with app overview
- **Dashboard (`/dashboard`)**: Protected user dashboard
- **Friends (`/friends`)**: Manage your friends list
- **Add Experience (`/add-experience`)**: Create new experiences
- **Edit Experience (`/edit-experience/[id]`)**: Edit existing experiences

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Fork this repository on GitHub
2. Connect your Vercel account to GitHub
3. Import the project in Vercel
4. Add your environment variables in the Vercel dashboard
5. Deploy!

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Need Help?

If you encounter any issues:

1. Check the [Issues](https://github.com/Ehsaan75/Away-Days/issues) section
2. Create a new issue with detailed information about your problem

---

**Happy planning! 🚀**