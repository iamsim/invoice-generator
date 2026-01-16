# Invoice Generator Frontend

A modern React application built with Vite, shadcn/ui, and connected to a Node.js/Express backend.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

3. Update the `.env` file with your backend API URL:
```
VITE_API_BASE_URL=http://localhost:3000
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will start on `http://localhost:5173` (or the next available port).

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ui/          # shadcn/ui components
│   ├── contexts/        # React contexts (Auth, etc.)
│   ├── lib/            # Utilities and API client
│   ├── pages/          # Page components
│   ├── App.jsx         # Main app component with routing
│   └── main.jsx        # Entry point
├── public/             # Static assets
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Features

- **Authentication**: Login page with backend API integration
- **Protected Routes**: Dashboard accessible only to authenticated users
- **shadcn/ui Components**: Modern, accessible UI components
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing

## API Integration

The frontend connects to the backend API at the URL specified in `VITE_API_BASE_URL`. The API client is configured in `src/lib/api.js` with:

- Automatic token injection for authenticated requests
- Error handling and token refresh logic
- Request/response interceptors

## Authentication Flow

1. User enters credentials on the login page
2. Frontend sends POST request to `/api/auth/login`
3. Backend returns user data and JWT token
4. Token is stored in localStorage
5. User is redirected to dashboard
6. Protected routes check authentication status

## Components

### shadcn/ui Components Used

- `Button` - Styled button component
- `Input` - Form input component
- `Card` - Card container component

All components are located in `src/components/ui/` and can be customized via Tailwind classes.
