# Contributing to WealthLog Backend

Thank you for your interest in contributing to WealthLog Backend! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB >= 6.0
- npm >= 9.0.0
- Git

### Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/your-username/wealthlog-backend.git
   cd wealthlog-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Run tests to verify setup:**
   ```bash
   npm run test:server
   npm run test:db
   npm run test:auth
   npm run test:financial
   ```

## 🏗️ Architecture Guidelines

### Clean Architecture Principles

This project follows **Clean Architecture** with strict layer separation:

1. **Domain Layer** (`src/domain/`)
   - Contains business entities and value objects
   - No dependencies on external frameworks
   - Pure business logic and validation

2. **Use Cases Layer** (`src/usecases/`)
   - Application-specific business logic
   - Orchestrates domain entities
   - Framework-independent

3. **Infrastructure Layer** (`src/infrastructure/`)
   - Database models and repositories
   - External service integrations
   - Framework-specific implementations

4. **Application Layer** (`src/app/`)
   - HTTP controllers and routes
   - Request/response handling
   - Middleware and validation

### Key Rules

- ✅ **Controllers** handle HTTP only, no business logic
- ✅ **Use Cases** contain pure business logic
- ✅ **Repositories** handle data access only
- ✅ **Entities** define business rules and validation
- ❌ **Never** put business logic in controllers
- ❌ **Never** make database calls from controllers
- ❌ **Never** import Express in use cases or domain

## 📝 Coding Standards

### Code Style
- Use **ESLint** and **Prettier** configurations provided
- Follow **camelCase** for variables and functions
- Use **PascalCase** for classes and constructors
- Use **UPPER_SNAKE_CASE** for constants

### File Naming
- Use **camelCase** for file names
- Use **PascalCase** for class files
- Use descriptive names that reflect functionality

### Documentation
- Add JSDoc comments for all public methods
- Include parameter and return type information
- Provide usage examples for complex functions

## 🧪 Testing Guidelines

### Test Requirements
- Write tests for all new features
- Maintain or improve test coverage
- Test both success and error scenarios
- Use descriptive test names

### Test Types
```bash
# Unit tests for individual components
npm test

# Integration tests for API endpoints
npm run test:server

# Database integration tests
npm run test:db

# Authentication flow tests
npm run test:auth

# Financial features tests
npm run test:financial
```

### Test Structure
```javascript
describe('FeatureName', () => {
  describe('methodName', () => {
    it('should handle success case', async () => {
      // Test implementation
    });

    it('should handle error case', async () => {
      // Test implementation
    });
  });
});
```

## 🔒 Security Guidelines

### Authentication & Authorization
- Always validate user ownership for data access
- Use JWT tokens for authentication
- Implement proper input validation
- Never expose sensitive data in responses

### Input Validation
- Validate all inputs at API boundaries
- Sanitize user inputs to prevent injection
- Use express-validator for consistent validation
- Return meaningful error messages

### Error Handling
- Never expose internal errors to clients
- Log security-related events
- Use ApiError class for consistent error responses
- Implement proper error boundaries

## 🚀 Contribution Process

### 1. Issue Creation
- Check existing issues before creating new ones
- Use issue templates when available
- Provide clear reproduction steps for bugs
- Include relevant system information

### 2. Branch Strategy
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Create bugfix branch
git checkout -b bugfix/issue-description

# Create hotfix branch
git checkout -b hotfix/critical-fix
```

### 3. Development Workflow
1. **Write tests first** (TDD approach recommended)
2. **Implement feature** following architecture guidelines
3. **Run all tests** to ensure nothing breaks
4. **Update documentation** if needed
5. **Commit changes** with descriptive messages

### 4. Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add transaction bulk delete functionality
fix: resolve category validation error
docs: update API documentation
test: add integration tests for auth
refactor: improve error handling in repositories
```

### 5. Pull Request Process
1. **Update your branch** with latest main
2. **Run all tests** and ensure they pass
3. **Create pull request** with clear description
4. **Link related issues** in PR description
5. **Request review** from maintainers

## 📋 Pull Request Checklist

- [ ] Code follows project architecture guidelines
- [ ] All tests pass (`npm test`)
- [ ] New features have corresponding tests
- [ ] Documentation is updated if needed
- [ ] Commit messages follow conventional format
- [ ] No sensitive information in code
- [ ] Error handling is implemented properly
- [ ] Input validation is added for new endpoints

## 🐛 Bug Reports

### Before Reporting
- Check if the bug has already been reported
- Verify the bug exists in the latest version
- Test with minimal reproduction case

### Bug Report Template
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Step one
2. Step two
3. Step three

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- Node.js version:
- MongoDB version:
- OS:

**Additional Context**
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Feature Description**
Clear description of the proposed feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other approaches you've considered

**Additional Context**
Any other relevant information
```

## 📚 Resources

### Documentation
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [MongoDB Best Practices](https://docs.mongodb.com/manual/administration/production-notes/)

### Tools
- [Postman Collection](docs/postman-collection.json) - API testing
- [VS Code Extensions](docs/vscode-extensions.md) - Recommended extensions
- [Database Schema](docs/database-schema.md) - Database design

## 🤝 Community

### Communication
- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and discussions
- **Pull Requests** - Code contributions and reviews

### Code of Conduct
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow project guidelines

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- CHANGELOG.md for significant contributions
- GitHub contributors page

Thank you for contributing to WealthLog Backend! 🚀