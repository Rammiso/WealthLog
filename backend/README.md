# WealthLog Backend API

Professional financial intelligence platform backend built with Node.js, Express, and MongoDB following Clean Architecture principles.

## 🏗️ Architecture

This backend implements **Clean Architecture** with clear separation of concerns:

```
backend/
├── src/
│   ├── app/                 # HTTP Layer
│   │   ├── server.js        # Express app setup
│   │   ├── routes/          # Route definitions (no logic)
│   │   ├── controllers/     # Request/response handling
│   │   ├── middlewares/     # Auth, error, validation
│   │   └── validators/      # Request validation schemas
│   │
│   ├── domain/              # Business Logic Layer
│   │   ├── entities/        # Core business models
│   │   └── valueObjects/    # Money, currency, etc.
│   │
│   ├── usecases/            # Application Logic Layer
│   │   ├── auth/            # Authentication business logic
│   │   ├── transaction/     # Transaction operations
│   │   └── category/        # Category management
│   │
│   ├── infrastructure/      # Infrastructure Layer
│   │   ├── database/        # MongoDB connection & models
│   │   ├── repositories/    # Data access layer
│   │   └── services/        # External services
│   │
│   ├── config/              # Configuration
│   └── utils/               # Utilities
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **MongoDB** >= 6.0
- **npm** >= 9.0.0

### Installation

1. **Clone and install:**
   ```bash
   git clone <repository-url>
   cd backend
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secrets
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Verify installation:**
   ```bash
   npm run test:server
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get user profile
- `PUT /api/v1/auth/profile` - Update profile

### Categories
- `GET /api/v1/categories` - Get user categories
- `POST /api/v1/categories` - Create category
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

### Transactions
- `GET /api/v1/transactions` - Get transactions (paginated)
- `POST /api/v1/transactions` - Create transaction
- `PUT /api/v1/transactions/:id` - Update transaction
- `DELETE /api/v1/transactions/:id` - Delete transaction
- `GET /api/v1/transactions/summary` - Financial summary

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/wealthlog |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration | 7d |

### Database Setup

1. **Install MongoDB** locally or use MongoDB Atlas
2. **Update MONGODB_URI** in `.env`
3. **Test connection:**
   ```bash
   npm run test:db
   ```

## 🧪 Testing

### Available Test Suites

```bash
# Test server endpoints
npm run test:server

# Test database connection
npm run test:db

# Test authentication system
npm run test:auth

# Test financial features
npm run test:financial
```

### Test Coverage

- ✅ Authentication (register, login, JWT)
- ✅ Categories (CRUD, validation)
- ✅ Transactions (CRUD, analytics)
- ✅ Security (unauthorized access)
- ✅ Data validation and sanitization

## 🔒 Security Features

### Authentication & Authorization
- **JWT-based authentication** with secure token handling
- **Password hashing** with bcrypt (12 rounds)
- **User-scoped data access** (users can only access their own data)
- **Input validation** and sanitization

### Security Middleware
- **Helmet** for security headers
- **CORS** configuration
- **Rate limiting** structure
- **Request logging** and monitoring

## 💰 Financial Features

### Multi-Currency Support
- **Ethiopian Birr (ETB)** as default currency
- Support for USD, EUR, GBP
- Currency validation and conversion ready

### Transaction Management
- Income and expense tracking
- Category-based organization
- Date range filtering
- Search functionality
- Financial summaries and analytics

### Category System
- Default categories for new users
- Custom category creation
- Color and icon support
- Usage tracking and validation

## 🏛️ Architecture Principles

### Clean Architecture Benefits
1. **Framework Independence** - Business logic doesn't depend on Express
2. **Database Independence** - Can switch databases without changing business logic
3. **Testability** - Each layer can be tested independently
4. **Maintainability** - Clear separation of concerns

### Layer Responsibilities
- **Controllers**: HTTP request/response handling only
- **Use Cases**: Pure business logic and validation
- **Repositories**: Data access abstraction
- **Entities**: Core business models and rules

## 📊 Performance & Monitoring

### Database Optimization
- **Indexes** on frequently queried fields
- **Aggregation pipelines** for analytics
- **Connection pooling** and optimization

### Logging & Monitoring
- **Winston** for structured logging
- **Request/response** logging
- **Error tracking** and reporting
- **Performance metrics**

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure production MongoDB URI
- [ ] Set strong JWT secrets (use crypto.randomBytes)
- [ ] Configure CORS for production domain
- [ ] Set up SSL/TLS certificates
- [ ] Configure logging and monitoring
- [ ] Set up backup strategy

### Docker Support
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

### Development Workflow
1. **Follow Clean Architecture** patterns
2. **Write tests** for new features
3. **Validate input** at API boundaries
4. **Log important operations**
5. **Update documentation**

### Code Standards
- **ESLint** configuration provided
- **Prettier** for code formatting
- **Conventional commits** preferred
- **Test coverage** for new features

## 📚 Additional Resources

### Documentation
- [Clean Architecture Guide](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [MongoDB Best Practices](https://docs.mongodb.com/manual/administration/production-notes/)

### Tools & Libraries
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Winston** - Logging
- **Helmet** - Security headers
- **Express-validator** - Input validation

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Musab Hassen**
- GitHub: [@musabhassen](https://github.com/musabhassen)
- LinkedIn: [Musab Hassen](https://linkedin.com/in/musab-hassen-b86247316)

---

Built with ❤️ for the Ethiopian fintech ecosystem