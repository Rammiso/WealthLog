# WealthLog Frontend-Backend Integration Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB running locally or connection string
- Git

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd wealthlog

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
# Database
DB_URI=mongodb://localhost:27017/wealthlog
DB_NAME=wealthlog

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development
API_VERSION=v1
API_PREFIX=/api/v1

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
# API Configuration
VITE_API_URL=http://localhost:3000/api/v1

# App Configuration
VITE_APP_NAME=WealthLog
VITE_APP_VERSION=1.0.0

# Environment
VITE_NODE_ENV=development
```

### 3. Start Development Servers

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api/v1
- **API Health Check**: http://localhost:3000/api/v1/health

## 🏗️ Architecture Overview

### Frontend Architecture
```
frontend/src/
├── Components/
│   ├── Dashboard/          # Dashboard-specific components
│   ├── ui/                 # Reusable UI components
│   └── ProtectedRoute.jsx  # Route protection
├── Context/
│   ├── AuthContext.jsx     # Authentication state
│   └── AppContext.jsx      # Global app state
├── Pages/
│   ├── Login.jsx          # Authentication pages
│   ├── Register.jsx
│   └── Dashboard.jsx      # Main dashboard
├── services/
│   └── apiService.js      # API communication layer
└── hooks/
    └── useDashboardData.js # Dashboard data management
```

### Backend Architecture
```
backend/src/
├── app/
│   ├── controllers/       # HTTP request handlers
│   ├── routes/           # API route definitions
│   ├── validators/       # Input validation
│   └── middlewares/      # Custom middleware
├── domain/
│   └── entities/         # Business logic entities
├── infrastructure/
│   ├── database/         # Database models & connection
│   ├── repositories/     # Data access layer
│   └── services/         # External services
├── usecases/
│   ├── auth/            # Authentication logic
│   ├── dashboard/       # Dashboard analytics
│   ├── goal/           # Goal management
│   └── transaction/    # Transaction management
└── utils/              # Utility functions
```

## 🔐 Authentication Flow

### 1. User Registration
```javascript
// Frontend
const result = await register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'securePassword123',
  currency: 'ETB'
});

// Backend API: POST /api/v1/auth/register
```

### 2. User Login
```javascript
// Frontend
const result = await login('john@example.com', 'securePassword123');

// Backend API: POST /api/v1/auth/login
// Returns: { token, user, refreshToken }
```

### 3. Protected Routes
```javascript
// Frontend - Automatic token handling
const response = await apiService.get('/dashboard/overview');

// Backend - JWT middleware validates all protected routes
```

## 📊 Dashboard Integration

### Real-time Data Flow

1. **Dashboard Load**: `useDashboardData` hook fetches all chart data
2. **Chart Components**: Receive formatted data from backend APIs
3. **User Interactions**: Forms update data and refresh charts
4. **Notifications**: Success/error feedback via global notification system

### Chart Data APIs

#### Expenses Pie Chart
```javascript
// Frontend
const data = await apiService.getExpensesPieData(month, year);

// Backend: GET /api/v1/dashboard/expenses-pie?month=11&year=2024
// Returns: { data: [{ name, value, color, percentage }], summary }
```

#### Income vs Expenses Line Chart
```javascript
// Frontend
const data = await apiService.getIncomeLineData(6); // 6 months

// Backend: GET /api/v1/dashboard/income-line?months=6
// Returns: { data: [{ month, income, expenses, netIncome }], insights }
```

#### Goals Progress
```javascript
// Frontend
const data = await apiService.getGoalsProgressData({ status: 'active' });

// Backend: GET /api/v1/dashboard/goals-progress?status=active
// Returns: { data: [{ id, title, progress, targetAmount }], summary }
```

## 💳 Transaction Management

### Create Transaction
```javascript
// Frontend - TransactionForm component
const result = await createTransaction({
  amount: 1500,
  description: 'Grocery shopping',
  categoryId: 'category-id',
  date: '2024-12-17',
  type: 'expense',
  currency: 'ETB'
});

// Backend: POST /api/v1/transactions
```

### Update Transaction
```javascript
// Frontend
const result = await updateTransaction(transactionId, updatedData);

// Backend: PUT /api/v1/transactions/:id
```

### Delete Transaction
```javascript
// Frontend
const result = await deleteTransaction(transactionId);

// Backend: DELETE /api/v1/transactions/:id
```

## 🎯 Goal Management

### Create Goal
```javascript
// Frontend
const result = await createGoal({
  title: 'Emergency Fund',
  description: 'Build 6 months of expenses',
  targetAmount: 50000,
  currentAmount: 10000,
  endDate: '2024-12-31',
  currency: 'ETB',
  priority: 'high'
});

// Backend: POST /api/v1/goals
```

### Update Goal Progress
```javascript
// Frontend
const result = await apiService.updateGoalProgress(goalId, newAmount);

// Backend: PATCH /api/v1/goals/:id/progress
```

## 🔔 Notification System

### Global Notifications
```javascript
// Frontend - useApp hook
const { addNotification } = useApp();

addNotification({
  type: 'success',
  title: 'Success',
  message: 'Transaction created successfully',
  duration: 5000
});
```

### Notification Types
- `success` - Green with checkmark
- `error` - Red with alert icon
- `warning` - Yellow with warning icon
- `info` - Cyan with info icon

## 🎨 UI/UX Features

### Cyberpunk Theme
- **Colors**: Neon cyan (#00ffff), neon green (#39ff14), dark backgrounds
- **Animations**: Framer Motion for smooth transitions
- **Effects**: Backdrop blur, gradient borders, glow effects
- **Typography**: Mono fonts for technical feel

### Responsive Design
- **Mobile-first**: Optimized for all screen sizes
- **Touch-friendly**: Large tap targets, swipe gestures
- **Progressive Enhancement**: Works without JavaScript

### Loading States
- **Skeleton Loading**: Placeholder content while loading
- **Spinner Animations**: Consistent loading indicators
- **Progressive Loading**: Load critical content first

## 🔧 Development Tools

### Backend Scripts
```bash
# Development
npm run dev              # Start with nodemon
npm run start           # Production start

# Testing
npm run test:server     # Test server functionality
npm run test:auth       # Test authentication
npm run test:goals      # Test goals functionality
npm run test:dashboard  # Test dashboard analytics

# Database
npm run seed           # Seed database with sample data
npm run migrate        # Run database migrations
```

### Frontend Scripts
```bash
# Development
npm run dev            # Start Vite dev server
npm run build          # Build for production
npm run preview        # Preview production build

# Code Quality
npm run lint           # ESLint check
```

## 🚨 Error Handling

### Frontend Error Handling
```javascript
// API Service automatically handles:
// - Network errors
// - Authentication errors (401)
// - Validation errors (400)
// - Server errors (500+)

// Components handle:
// - Form validation errors
// - Loading states
// - Empty data states
```

### Backend Error Handling
```javascript
// Consistent error responses:
{
  success: false,
  error: {
    type: 'ValidationError',
    message: 'Validation failed',
    details: [
      { field: 'email', message: 'Email is required' }
    ]
  }
}
```

## 🔒 Security Features

### Authentication
- **JWT Tokens**: Secure, stateless authentication
- **Token Refresh**: Automatic token renewal
- **Route Protection**: Protected routes require authentication
- **User Isolation**: Data scoped to authenticated user

### Input Validation
- **Frontend**: Real-time form validation
- **Backend**: Express-validator for all inputs
- **Sanitization**: XSS protection, SQL injection prevention

### API Security
- **CORS**: Configured for frontend domain
- **Rate Limiting**: Prevent API abuse
- **Helmet**: Security headers
- **Input Sanitization**: Clean all user inputs

## 📱 Mobile Considerations

### Responsive Features
- **Touch Gestures**: Swipe, tap, long-press
- **Mobile Navigation**: Collapsible sidebar
- **Optimized Forms**: Large inputs, proper keyboards
- **Performance**: Lazy loading, code splitting

### PWA Ready
- **Service Worker**: Offline functionality
- **App Manifest**: Install as native app
- **Push Notifications**: Real-time updates

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel, Netlify, or any static host
# Set environment variables in hosting platform
```

### Backend Deployment
```bash
# Deploy to Heroku, Railway, or any Node.js host
# Set environment variables in hosting platform
# Ensure MongoDB connection string is configured
```

### Environment Variables
- **Frontend**: `VITE_API_URL` must point to production API
- **Backend**: `CORS_ORIGIN` must include production frontend URL

## 🐛 Troubleshooting

### Common Issues

#### CORS Errors
```bash
# Backend .env
CORS_ORIGIN=http://localhost:5173,https://your-frontend-domain.com
```

#### Database Connection
```bash
# Check MongoDB is running
mongosh
# or
docker run -d -p 27017:27017 mongo
```

#### Authentication Issues
```bash
# Clear browser storage
localStorage.clear()
# Check JWT_SECRET is set in backend .env
```

#### API Not Found
```bash
# Verify API_URL in frontend .env
VITE_API_URL=http://localhost:3000/api/v1
```

### Debug Mode
```bash
# Backend - Enable debug logging
DEBUG=* npm run dev

# Frontend - Check browser console
# Network tab shows API requests/responses
```

## 📈 Performance Optimization

### Frontend
- **Code Splitting**: Lazy load components
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: Large lists performance
- **Image Optimization**: WebP, lazy loading

### Backend
- **Database Indexing**: Optimized queries
- **Caching**: Redis for frequent data
- **Compression**: Gzip responses
- **Rate Limiting**: Prevent abuse

## 🔄 Data Flow Summary

1. **User Authentication**: Login → JWT token stored → All requests authenticated
2. **Dashboard Load**: Fetch overview → Load charts → Display data
3. **User Actions**: Form submission → API call → Update state → Refresh UI
4. **Real-time Updates**: WebSocket connections for live data (future)
5. **Error Handling**: Try/catch → User feedback → Graceful degradation

## 🎉 Success Indicators

After successful integration, you should have:

✅ **Authentication**: Users can register, login, and access dashboard  
✅ **Dashboard**: Real charts with actual user data  
✅ **Transactions**: Create, edit, delete transactions  
✅ **Goals**: Set and track financial goals  
✅ **Analytics**: Monthly summaries and insights  
✅ **Responsive**: Works on all devices  
✅ **Secure**: Protected routes and data isolation  
✅ **Fast**: Optimized loading and interactions  

## 📞 Support

For issues or questions:
1. Check this integration guide
2. Review error logs in browser console
3. Check backend logs for API errors
4. Verify environment variables are set correctly
5. Ensure all dependencies are installed

The integration provides a solid foundation for a modern, secure, and scalable financial management application with a futuristic cyberpunk aesthetic.