# WealthLog Deployment Guide

This guide covers different deployment options for the WealthLog application.

## 🚀 Quick Deploy Options

### Option 1: Railway (Backend) + Vercel (Frontend) - Recommended

#### Backend Deployment on Railway

1. **Create Railway Account**
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Navigate to backend directory
   cd backend
   
   # Deploy
   railway up
   ```

3. **Set Environment Variables in Railway Dashboard**
   ```env
   NODE_ENV=production
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   BCRYPT_ROUNDS=12
   ```

4. **Add MongoDB Database**
   - In Railway dashboard, click "New" → "Database" → "MongoDB"
   - Copy the connection string to MONGODB_URI

#### Frontend Deployment on Vercel

1. **Create Vercel Account**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - Connect your GitHub repository
   - Select the `frontend` folder as root directory
   - Set build command: `npm run build`
   - Set output directory: `dist`

3. **Set Environment Variables**
   ```env
   VITE_API_URL=https://your-railway-backend-url.railway.app/api/v1
   ```

### Option 2: Heroku (Full Stack)

#### Backend on Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd backend
   heroku create wealthlog-backend
   ```

3. **Add MongoDB Atlas**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-super-secret-jwt-key
   heroku config:set JWT_EXPIRES_IN=7d
   heroku config:set BCRYPT_ROUNDS=12
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

#### Frontend on Heroku

1. **Create Frontend App**
   ```bash
   cd frontend
   heroku create wealthlog-frontend
   ```

2. **Add Buildpack**
   ```bash
   heroku buildpacks:set heroku/nodejs
   heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static
   ```

3. **Create static.json**
   ```json
   {
     "root": "dist/",
     "routes": {
       "/**": "index.html"
     }
   }
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set VITE_API_URL=https://wealthlog-backend.herokuapp.com/api/v1
   ```

### Option 3: Docker Deployment

#### Using Docker Compose (Local/VPS)

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/wealthlog.git
   cd wealthlog
   ```

2. **Update Environment Variables**
   - Edit `docker-compose.yml`
   - Change JWT_SECRET and MongoDB credentials

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

4. **Access Application**
   - Frontend: http://localhost
   - Backend: http://localhost:3000
   - MongoDB: localhost:27017

#### Individual Docker Containers

1. **Build Images**
   ```bash
   # Backend
   cd backend
   docker build -t wealthlog-backend .
   
   # Frontend
   cd ../frontend
   docker build -t wealthlog-frontend .
   ```

2. **Run Containers**
   ```bash
   # MongoDB
   docker run -d --name mongodb -p 27017:27017 mongo:7
   
   # Backend
   docker run -d --name backend -p 3000:3000 \
     -e MONGODB_URI=mongodb://mongodb:27017/wealthlog \
     -e JWT_SECRET=your-secret \
     --link mongodb \
     wealthlog-backend
   
   # Frontend
   docker run -d --name frontend -p 80:80 wealthlog-frontend
   ```

## 🔧 Environment Variables

### Backend Required Variables
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/wealthlog
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
```

### Frontend Required Variables
```env
VITE_API_URL=https://your-backend-url.com/api/v1
```

## 📊 Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create free cluster

2. **Configure Access**
   - Add IP addresses (0.0.0.0/0 for all IPs)
   - Create database user

3. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/wealthlog?retryWrites=true&w=majority
   ```

### Local MongoDB
```bash
# Install MongoDB
brew install mongodb/brew/mongodb-community  # macOS
sudo apt install mongodb                     # Ubuntu

# Start MongoDB
brew services start mongodb-community       # macOS
sudo systemctl start mongodb                # Ubuntu
```

## 🔒 Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use strong MongoDB credentials
- [ ] Enable HTTPS in production
- [ ] Set proper CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication
- [ ] Set up proper firewall rules
- [ ] Use secure headers (Helmet.js)

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check VITE_API_URL in frontend
   - Verify CORS settings in backend

2. **Database Connection**
   - Verify MongoDB URI format
   - Check network connectivity
   - Ensure database user has proper permissions

3. **Build Failures**
   - Check Node.js version (>=18)
   - Clear node_modules and reinstall
   - Verify all environment variables

4. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Ensure consistent secret across deployments

### Logs and Monitoring

```bash
# Railway logs
railway logs

# Heroku logs
heroku logs --tail

# Docker logs
docker logs container-name

# PM2 logs (if using PM2)
pm2 logs
```

## 📈 Performance Optimization

### Backend
- Enable compression middleware ✅
- Use MongoDB indexes
- Implement caching (Redis)
- Use CDN for static assets

### Frontend
- Enable gzip compression ✅
- Optimize images
- Use lazy loading
- Implement service workers

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm ci
      - run: cd backend && npm test
      - uses: railwayapp/cli@v2
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
          command: up

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd frontend && npm ci
      - run: cd frontend && npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

**Need help?** Open an issue on GitHub or check the troubleshooting section above.