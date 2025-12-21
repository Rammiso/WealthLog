# WealthLog - Personal Finance Management System

A modern, full-stack personal finance management application built with React, Node.js, and MongoDB. Track your income, expenses, set financial goals, and get insights into your spending patterns.

## 🚀 Features

- **Dashboard Analytics**: Real-time financial overview with interactive charts
- **Transaction Management**: Track income and expenses with categories
- **Financial Goals**: Set and monitor progress towards financial objectives
- **Category Management**: Organize transactions with custom categories
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Secure Authentication**: JWT-based authentication with password hashing
- **Data Visualization**: Beautiful charts and graphs using Recharts
- **Real-time Updates**: Dashboard automatically refreshes after transactions

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Lucide React** for icons
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing
- **Winston** for logging
- **Joi** for validation

## 📦 Project Structure

```
wealthlog/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── Components/      # Reusable UI components
│   │   ├── Pages/          # Page components
│   │   ├── Context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   └── services/       # API service layer
│   └── public/             # Static assets
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── app/            # Express app configuration
│   │   ├── usecases/       # Business logic layer
│   │   ├── infrastructure/ # Database and external services
│   │   └── utils/          # Utility functions
│   └── scripts/            # Database scripts
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/wealthlog.git
   cd wealthlog
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Copy environment variables
   cp .env.example .env
   # Edit .env with your MongoDB connection string and JWT secret
   
   # Start the backend server
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Copy environment variables
   cp .env.example .env
   # Edit .env with your backend API URL
   
   # Start the development server
   npm run dev
   ```

4. **Create Sample Data (Optional)**
   ```bash
   cd backend
   node scripts/create-sample-data.js
   ```

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/wealthlog
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api/v1
```

## 📱 Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Add Categories**: Set up income and expense categories
3. **Track Transactions**: Add your income and expenses
4. **Set Goals**: Create financial goals and track progress
5. **View Analytics**: Monitor your financial health through the dashboard

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)
1. Set environment variables in your hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy from GitHub repository

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Set VITE_API_URL to your deployed backend URL
3. Deploy the `dist` folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)
- UI inspiration from modern fintech applications

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ for better financial management**
