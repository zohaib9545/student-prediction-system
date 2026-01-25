# Student Performance Prediction System

A full-stack web application for predicting student final marks based on assignments, quizzes, and midterm scores. Built with Node.js, React, and MongoDB.

## Features

- User authentication (students and teachers)
- Performance prediction using weighted scores
- Dashboard with charts and analytics
- Teacher view for class performance
- Responsive UI with Tailwind CSS

## Quick Start (Simplest Method)

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Running the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/zohaib9545/student-prediction-system.git
   cd student-prediction-system
   ```

2. Set up environment:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Update `backend/.env` with your MongoDB URI (for local MongoDB: `mongodb://localhost:27017/student_prediction`)

3. Start the services:
   ```bash
   ./start-dev.sh
   ```
   This will automatically install dependencies and start both backend (port 5000) and frontend (port 3000).

4. Access the app at `http://localhost:3000`

### Stopping the Services
```bash
kill $(cat logs/backend.pid) $(cat logs/frontend.pid)
```

### Manual Start/Stop (Alternative)

If you prefer manual control:

**Start Backend:**
```bash
cd backend
npm install
npm run dev
```

**Start Frontend (in another terminal):**
```bash
cd frontend
npm install
npm run dev
```

**Stop Services:**
Find and kill the Node.js processes, or use the PIDs from `logs/` folder.

## Deployment

### 1. Database: MongoDB Atlas

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get the connection string (replace `<password>` and `<dbname>`)
4. Whitelist your IP or allow access from anywhere (for deployment)

### 2. Backend: Render

1. Sign up at [Render](https://render.com)
2. Connect your GitHub repo
3. Create a new Web Service
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables:
   - `PORT`: 5000
   - `MONGO_URI`: Your Atlas connection string
   - `JWT_SECRET`: A random secret string
   - `JWT_EXPIRES_IN`: 7d
7. Deploy

### 3. Frontend: Vercel

1. Sign up at [Vercel](https://vercel.com)
2. Connect your GitHub repo
3. Deploy the `frontend` folder
4. Add environment variable:
   - `VITE_API_BASE`: Your Render backend URL + `/api` (e.g., `https://your-app.onrender.com/api`)
5. Deploy

### 4. Update Backend CORS (if needed)

In `backend/app.js`, ensure CORS allows your frontend domain.

## API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/performance/submit` - Submit performance data
- `GET /api/performance/history` - Get user history
- `GET /api/performance/analytics` - Get analytics (teacher)

## Technologies

- **Backend**: Node.js, Express, MongoDB, JWT
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Deployment**: Render, Vercel, MongoDB Atlas

## License

MIT