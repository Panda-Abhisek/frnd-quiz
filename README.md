# Friendship Quiz

An interactive, beautifully designed friendship quiz application with a Node.js backend and React frontend.

## Features

- 🎨 Beautiful, animated UI with glassmorphism effects
- 💾 Backend API with database storage
- 🔄 Single PostgreSQL database for dev & prod
- 🌍 Environment-based configuration
- ✨ Smooth animations and transitions

## Tech Stack

**Frontend:**
- React 19
- Vite
- Framer Motion
- Tailwind CSS v4

**Backend:**
- Node.js
- Express
- PostgreSQL

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd friendship-quiz
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

### Development Setup

1. **Configure environment variables**

   Frontend (root directory):
   ```bash
   cp .env.example .env.development
   ```
   
   Backend (server directory):
   ```bash
   cp server/.env.example server/.env
   ```

2. **Start the backend server**
   ```bash
   cd server
   npm start
   ```
   Server will run on `http://localhost:3000`

3. **Start the frontend (in a new terminal)**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173` (or next available port)

4. **Open your browser**
   Navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Environment Variables

### Frontend (.env.development / .env.production)

```env
VITE_API_URL=http://localhost:3000
```

### Backend (server/.env)

```env
# Server Configuration
PORT=3000

# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database
```

## Production Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Set environment variables in your hosting platform**
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

3. **Deploy the `dist` folder**

### Backend Deployment (Railway/Render/Heroku)

1. **Set environment variables**
   ```env
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgresql://username:password@host:port/database
   ```

2. **Deploy the `server` directory**

3. **Database setup**
   - The PostgreSQL table will be created automatically on first run
   - Make sure your DATABASE_URL is correctly configured

### Database Schema

The application automatically creates/updates the required table in PostgreSQL:
```sql
CREATE TABLE IF NOT EXISTS responses (
  id SERIAL PRIMARY KEY,
  answers JSONB,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## API Endpoints

### POST /api/submit
Submit quiz answers

**Request:**
```json
{
  "answers": {
    "1": "You",
    "2": "Me (Tripped over air)",
    "3": "Chaotic Good",
    "4": "Stole a penguin",
    "5": "To the moon"
  }
}
```

**Response:**
```json
{
  "message": "Responses saved successfully",
  "id": 1
}
```

### GET /api/responses
Retrieve all quiz responses (for verification)

**Response:**
```json
{
  "message": "Success",
  "data": [
    {
      "id": 1,
      "answers": { ... },
      "timestamp": "2025-12-03 06:57:41"
    }
  ]
}
```

## Project Structure

```
friendship-quiz/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── data/              # Quiz questions
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── server/                # Backend source
│   ├── index.js           # Express server
│   ├── db.js              # Database abstraction
│   └── .env               # Backend environment variables
├── .env.development       # Frontend dev environment
├── .env.production        # Frontend prod environment
└── package.json           # Frontend dependencies
```

## Troubleshooting

**Port already in use:**
- Frontend: Vite will automatically try the next available port
- Backend: Change the PORT in `server/.env`

**Database connection errors:**
- Verify your `DATABASE_URL` is correct and the PostgreSQL server is accessible

**CORS errors:**
- Ensure VITE_API_URL matches your backend URL
- Check that the backend CORS configuration allows your frontend domain

## License

MIT
