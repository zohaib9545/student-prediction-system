# Student Performance Prediction System

A full-stack web application for predicting student final marks based on assignments, quizzes, and midterm scores. Built with Node.js, React, MongoDB, and Docker.

## Features

- User authentication (students and teachers)
- Performance prediction using weighted scores
- Dashboard with charts and analytics
- Teacher view for class performance
- Responsive UI with Tailwind CSS

## Local Development

### Prerequisites

- Docker and Docker Compose
- Node.js (for local frontend dev)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/zohaib9545/student-prediction-system.git
   cd student-prediction-system
   ```

2. Copy environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp .env.compose.example .env
   ```

3. Update `backend/.env` with your MongoDB URI (for local, use `mongodb://mongo:27017/student_prediction`)

4. Run with Docker:
   ```bash
   docker-compose up --build
   ```

5. Access the app at `http://localhost:3000`

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
- **Deployment**: Docker, Render, Vercel, MongoDB Atlas

## License

MIT