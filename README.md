<div align="center">
  <img src="https://img.shields.io/badge/WealthLog-Personal%20Finance-00D4AA?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K" alt="WealthLog Logo"/>
  
  # 💰 WealthLog
  
  ### *Smart Personal Finance Management for the Modern Era*
  
  <p align="center">
    <strong>Track • Analyze • Achieve</strong><br>
    A comprehensive financial intelligence platform built with cutting-edge technology
  </p>

  <p align="center">
    <a href="#-features"><strong>Features</strong></a> •
    <a href="#-quick-start"><strong>Quick Start</strong></a> •
    <a href="#-tech-stack"><strong>Tech Stack</strong></a> •
    <a href="#-deployment"><strong>Deploy</strong></a> •
    <a href="#-contributing"><strong>Contribute</strong></a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react" alt="React"/>
    <img src="https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js" alt="Node.js"/>
    <img src="https://img.shields.io/badge/MongoDB-7.x-47A248?style=flat-square&logo=mongodb" alt="MongoDB"/>
    <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="License"/>
  </p>

  <p align="center">
    <img src="https://img.shields.io/github/stars/Rammiso/WealthLog?style=social" alt="GitHub stars"/>
    <img src="https://img.shields.io/github/forks/Rammiso/WealthLog?style=social" alt="GitHub forks"/>
    <img src="https://img.shields.io/github/watchers/Rammiso/WealthLog?style=social" alt="GitHub watchers"/>
  </p>
</div>

---

## 🌟 Overview

**WealthLog** is a next-generation personal finance management platform that transforms how you interact with your money. Built with modern web technologies and designed with user experience at its core, WealthLog provides powerful insights into your financial health while maintaining simplicity and elegance.

> *"Financial freedom starts with financial awareness"*

### 🎯 Why WealthLog?

- **🧠 Intelligent Analytics** - AI-powered insights into your spending patterns
- **⚡ Real-time Updates** - Instant dashboard refresh after every transaction
- **🎨 Modern UI/UX** - Beautiful, responsive design with smooth animations
- **🔒 Bank-level Security** - JWT authentication with bcrypt encryption
- **📱 Mobile-first** - Optimized for all devices and screen sizes
- **🚀 Lightning Fast** - Built with performance optimization in mind

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📊 **Smart Dashboard**
- Real-time financial overview
- Interactive charts and visualizations
- Monthly/yearly trend analysis
- Spending pattern recognition

### 💳 **Transaction Management**
- Quick income/expense tracking
- Smart categorization system
- Bulk transaction operations
- Advanced filtering and search

</td>
<td width="50%">

### 🎯 **Goal Tracking**
- Set and monitor financial objectives
- Progress visualization
- Deadline reminders
- Achievement celebrations

### 📈 **Analytics & Insights**
- Spending behavior analysis
- Budget vs actual comparisons
- Category-wise breakdowns
- Export capabilities

</td>
</tr>
</table>

### 🔥 Advanced Features

- **🤖 Smart Categorization** - Automatic transaction categorization using ML
- **📊 Data Visualization** - Beautiful charts powered by Recharts
- **🔄 Real-time Sync** - Instant updates across all components
- **🎨 Theme Customization** - Dark/light mode with custom themes
- **📱 PWA Ready** - Install as a native app on any device
- **🔐 Privacy First** - Your data stays secure and private

---

## � ️ Tech Stack

<div align="center">

### Frontend Architecture
<img src="https://skillicons.dev/icons?i=react,vite,tailwind,js" alt="Frontend Stack"/>

### Backend Infrastructure  
<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,jwt" alt="Backend Stack"/>

### DevOps & Deployment
<img src="https://skillicons.dev/icons?i=docker,vercel,railway,github" alt="DevOps Stack"/>

</div>

<details>
<summary><strong>📋 Detailed Technology Breakdown</strong></summary>

#### **Frontend Excellence**
- **⚛️ React 18** - Latest features with concurrent rendering
- **⚡ Vite** - Lightning-fast build tool and dev server
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🎭 Framer Motion** - Production-ready motion library
- **📊 Recharts** - Composable charting library
- **🧭 React Router** - Declarative routing for React

#### **Backend Power**
- **🟢 Node.js 18+** - JavaScript runtime built on Chrome's V8
- **🚀 Express.js** - Fast, unopinionated web framework
- **🍃 MongoDB** - Document-based NoSQL database
- **🔐 JWT** - Secure token-based authentication
- **🛡️ bcrypt** - Industry-standard password hashing
- **📝 Winston** - Professional logging library

#### **Development & Deployment**
- **🐳 Docker** - Containerization for consistent environments
- **☁️ Vercel** - Frontend deployment and hosting
- **🚄 Railway** - Backend deployment and database hosting
- **🔄 GitHub Actions** - CI/CD pipeline automation

</details>

---

## 🚀 Quick Start

### Prerequisites

<table>
<tr>
<td>

**Required**
- Node.js 18+ 
- npm or yarn
- MongoDB (local or cloud)

</td>
<td>

**Recommended**
- Git
- VS Code
- MongoDB Compass

</td>
</tr>
</table>

### ⚡ One-Click Setup

```bash
# Clone the repository
git clone https://github.com/Rammiso/WealthLog.git
cd WealthLog

# Install dependencies for both frontend and backend
npm run install:all

# Set up environment variables
npm run setup:env

# Start development servers
npm run dev
```

### 🔧 Manual Setup

<details>
<summary><strong>Step-by-step installation</strong></summary>

#### 1. **Backend Setup**
```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start the backend server
npm start
```

#### 2. **Frontend Setup**
```bash
cd frontend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your backend API URL

# Start the development server
npm run dev
```

#### 3. **Database Setup**
```bash
# Create sample data (optional)
cd backend
node scripts/create-sample-data.js
```

</details>

### 🐳 Docker Setup

```bash
# One command to rule them all
docker-compose up -d

# Access your application
# Frontend: http://localhost
# Backend: http://localhost:3000
# MongoDB: localhost:27017
```

---

## 📁 Project Architecture

```
WealthLog/
├── 🎨 frontend/                 # React application
│   ├── src/
│   │   ├── Components/         # Reusable UI components
│   │   ├── Pages/             # Route-based page components
│   │   ├── Context/           # React context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service layer
│   │   └── utils/             # Utility functions
│   ├── public/                # Static assets
│   └── dist/                  # Production build
├── 🔧 backend/                  # Node.js API server
│   ├── src/
│   │   ├── app/               # Express app configuration
│   │   ├── usecases/          # Business logic layer
│   │   ├── infrastructure/    # Database & external services
│   │   ├── utils/             # Utility functions
│   │   └── config/            # Configuration files
│   └── scripts/               # Database scripts & tools
├── 🐳 docker-compose.yml       # Container orchestration
├── 📚 DEPLOYMENT.md            # Deployment guide
└── 📖 README.md               # You are here
```

---

## 🚀 Deployment

### 🌟 Recommended: Railway + Vercel

<table>
<tr>
<td width="50%">

#### **Backend on Railway**
```bash
npm install -g @railway/cli
railway login
cd backend
railway up
```

</td>
<td width="50%">

#### **Frontend on Vercel**
```bash
npm install -g vercel
cd frontend
vercel --prod
```

</td>
</tr>
</table>

### 🐳 Docker Deployment

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# Development with hot reload
docker-compose up -d
```

### ☁️ Cloud Platforms

<div align="center">

| Platform | Backend | Frontend | Database |
|----------|---------|----------|----------|
| **Railway** | ✅ Recommended | ❌ | ✅ MongoDB |
| **Vercel** | ❌ | ✅ Recommended | ❌ |
| **Heroku** | ✅ Good | ✅ Good | ✅ MongoDB Atlas |
| **DigitalOcean** | ✅ VPS | ✅ Static | ✅ Managed DB |

</div>

> 📖 **Detailed deployment instructions**: See [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🔧 Configuration

### Environment Variables

<details>
<summary><strong>Backend Configuration</strong></summary>

```env
# Server Configuration
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/wealthlog

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# Optional: Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

</details>

<details>
<summary><strong>Frontend Configuration</strong></summary>

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api/v1

# Optional: Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
```

</details>

---

## 🤝 Contributing

We love contributions! Here's how you can help make WealthLog even better:

### 🌟 Ways to Contribute

- 🐛 **Bug Reports** - Found a bug? Let us know!
- 💡 **Feature Requests** - Have an idea? We'd love to hear it!
- 📝 **Documentation** - Help improve our docs
- 🔧 **Code Contributions** - Submit a pull request

### 🚀 Development Workflow

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/amazing-feature

# 3. Make your changes
# 4. Test your changes
npm run test

# 5. Commit with conventional commits
git commit -m "feat: add amazing feature"

# 6. Push and create a pull request
git push origin feature/amazing-feature
```

### 📋 Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass

---

## 📊 Roadmap

### 🎯 Current Sprint (v1.1)
- [ ] **Mobile App** - React Native implementation
- [ ] **AI Insights** - Machine learning spending predictions
- [ ] **Bank Integration** - Connect with banking APIs
- [ ] **Multi-currency** - Support for multiple currencies

### 🚀 Future Releases
- [ ] **Investment Tracking** - Portfolio management
- [ ] **Bill Reminders** - Automated payment notifications  
- [ ] **Family Sharing** - Multi-user account management
- [ ] **Advanced Analytics** - Custom reporting dashboard

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - feel free to use this project for personal or commercial purposes
```

---

## 🙏 Acknowledgments

<div align="center">

**Built with ❤️ by passionate developers**

Special thanks to the amazing open-source community and these fantastic projects:

<img src="https://skillicons.dev/icons?i=react,nodejs,mongodb,tailwind,vite,express" alt="Technologies"/>

</div>

### 🌟 Credits

- **Icons** - [Lucide React](https://lucide.dev/)
- **Charts** - [Recharts](https://recharts.org/)
- **Animations** - [Framer Motion](https://www.framer.com/motion/)
- **Styling** - [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">

### 💬 Get in Touch

<p>
  <a href="https://github.com/Rammiso/WealthLog/issues">🐛 Report Bug</a> •
  <a href="https://github.com/Rammiso/WealthLog/issues">💡 Request Feature</a> •
  <a href="mailto:your-email@example.com">📧 Contact</a>
</p>

**⭐ Star this repository if you found it helpful!**

<img src="https://img.shields.io/github/stars/Rammiso/WealthLog?style=social" alt="GitHub stars"/>

---

*Made with 💰 for better financial management*

</div>
