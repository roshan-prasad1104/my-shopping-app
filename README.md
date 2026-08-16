# My Shopping App - Enterprise E-Commerce Platform

A production-ready, full-stack e-commerce platform featuring a cross-platform mobile application built with React Native (Expo) and a scalable Node.js/Express backend with MongoDB. Architected with industry best practices including clean code principles, RESTful API design, comprehensive error handling, and security-first development.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture & System Design](#architecture--system-design)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Code Quality & Best Practices](#code-quality--best-practices)
- [Performance Optimization](#performance-optimization)
- [Security Implementation](#security-implementation)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project demonstrates a comprehensive understanding of modern full-stack development, implementing:

- **Cross-Platform Mobile Development** - Native app performance using React Native with code reusability across iOS, Android, and Web platforms
- **Microservice-Ready Architecture** - Modular backend design facilitating future service decomposition
- **Enterprise-Grade Error Handling** - Comprehensive exception handling, logging, and monitoring capabilities
- **Security-First Implementation** - JWT-based authentication, input validation, CORS configuration, and secure credential management
- **Scalable Data Persistence** - MongoDB integration with proper indexing and query optimization strategies
- **Professional Development Practices** - Environment-based configuration, version control, and documentation standards

## ✨ Features

### Frontend (React Native / Expo)

**User Experience & Interface**
- **Cross-Platform Compatibility** - Single codebase deployable to iOS, Android, and Web platforms with platform-specific optimizations
- **Product Catalog Management** - Advanced filtering, search, and category-based browsing with real-time inventory status
- **E-Commerce Cart System** - Stateful cart management with persistent storage using AsyncStorage and Context API
- **Secure Authentication Flow** - JWT-based authentication with token refresh mechanisms and secure credential storage

**Advanced Features**
- **Real-Time Order Tracking** - Live order status updates from placement through delivery
- **Role-Based Access Control** - Admin dashboard for inventory and order management with permission-based UI rendering
- **Data Visualization** - Chart.js integration for sales analytics and performance metrics
- **Offline Capability** - AsyncStorage for cart persistence enabling offline functionality

### Backend (Express.js)

**API Architecture**
- **RESTful API Design** - Stateless, scalable API following REST conventions with proper HTTP status codes
- **Modular Routing Structure** - Organized route handlers facilitating maintainability and feature expansion
- **Request/Response Validation** - Input sanitization and validation at middleware level preventing injection attacks
- **Comprehensive Error Handling** - Centralized error handling with appropriate HTTP status codes and error messages

**Database & Persistence**
- **MongoDB Integration** - NoSQL database with Mongoose ODM for schema validation and query optimization
- **Data Indexing** - Optimized queries through strategic indexing on frequently accessed fields
- **Transaction Support** - ACID-compliant operations for critical business transactions
- **Scalable Schema Design** - Normalized database design supporting horizontal scaling

**Authentication & Security**
- **JWT Token Management** - Bearer token authentication with configurable expiration and refresh mechanisms
- **Password Security** - Industry-standard encryption for user credentials
- **Role-Based Authorization** - Middleware-level access control for protected endpoints
- **CORS Configuration** - White-listed origin validation preventing unauthorized cross-origin requests

## 🏗️ Architecture & System Design

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────┐  │
│  │   iOS (Native)   │  │ Android (Native) │  │    Web    │  │
│  │   React Native   │  │   React Native   │  │   React   │  │
│  └────────┬─────────┘  └────────┬─────────┘  └─────┬─────┘  │
│           └───────────────────────────────────────┘         │
│                        Expo Framework                        │
│                         (Unified)                            │
└─────────────────┬──────────────────────────────────────────┘
                  │ HTTP/HTTPS
                  │ REST API
┌─────────────────┴──────────────────────────────────────────┐
│                    API Gateway Layer                        │
│               Express.js Server (Port 3000)                 │
├───────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐  │
│  │            Middleware Stack                         │  │
│  │  ├─ CORS Validation                                │  │
│  │  ├─ Request Logging                                │  │
│  │  ├─ Input Validation                               │  │
│  │  ├─ Authentication (JWT)                           │  │
│  │  └─ Error Handling                                 │  │
│  └─────────────────────────────────────────────────────┘  │
├───────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Routes     │  │ Controllers  │  │   Services   │    │
│  │              │  │              │  │              │    │
│  │ ├─ /products │  │ ├─ Product   │  │ ├─ Auth      │    │
│  │ ├─ /orders   │  │ ├─ Order     │  │ ├─ Cart      │    │
│  │ └─ /auth     │  │ └─ User      │  │ └─ Inventory │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
├───────────────────────────────────────────────────────────┤
│              Database Models (Mongoose)                    │
│  ├─ Product Schema    ├─ User Schema                      │
│  ├─ Order Schema      └─ Category Schema                  │
└───────────────────────────────────────────────────────────┘
                  │ MongoDB Driver
                  │ Connection Pool
┌─────────────────┴──────────────────────────────────────────┐
│            Data Persistence Layer                          │
│         MongoDB Atlas / Local MongoDB Instance             │
│  ├─ Database: shopping_app                                │
│  ├─ Collections: products, orders, users, categories      │
│  └─ Indexes: On frequently queried fields                 │
└──────────────────────────────────────────────────────────┘
```

### Design Patterns Implemented

- **MVC Architecture** - Separation of concerns with Models, Views (API), and Controllers
- **Context API Pattern** - Global state management for cart and product catalog (Frontend)
- **Middleware Chain Pattern** - Sequential processing of requests through validation, authentication, and business logic
- **Repository Pattern** - Abstraction layer for database operations (via Mongoose models)
- **Error Handling Pattern** - Centralized exception handling with proper HTTP status codes

## 🛠️ Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React Native** | 0.81.5 | Cross-platform mobile framework |
| **Expo** | ~54.0.33 | Development and deployment platform |
| **React Navigation** | 7.1.28+ | Stack-based navigation system |
| **Context API** | Built-in | State management (Cart, Products) |
| **AsyncStorage** | ~5.6.0 | Persistent local storage |
| **Axios** | 1.13.5+ | HTTP client with interceptor support |
| **Firebase** | 12.9.0+ | Authentication and backend services |
| **React Native Chart Kit** | 6.12.0+ | Data visualization |
| **React DOM** | 19.1.0 | Web platform rendering |
| **React Native Web** | 0.21.0+ | Web compatibility layer |

### Backend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 14+ | Runtime environment |
| **Express.js** | 5.2.1+ | Web framework and HTTP server |
| **MongoDB** | Latest | NoSQL database |
| **Mongoose** | 9.2.1+ | ODM and schema validation |
| **CORS** | 2.8.6+ | Cross-origin resource sharing |
| **dotenv** | 17.3.1+ | Environment variable management |

### Development & DevOps Tools

- **npm/yarn** - Package management
- **Git** - Version control
- **VS Code** - Development environment
- **Postman** - API testing
- **MongoDB Compass** - Database management (optional)

## 📦 Prerequisites

Before initializing the development environment, verify the following system requirements:

- **Node.js** - v14.0.0 or higher (LTS versions recommended)
- **npm** - v6.0.0+ or **yarn** - v1.22.0+
- **MongoDB** - Local instance or MongoDB Atlas cloud account
- **Git** - v2.30.0+
- **Expo CLI** - Latest version (install via npm)
  ```bash
  npm install -g expo-cli
  ```

### Optional Prerequisites

- **Android Studio** - For Android emulator testing
- **Xcode** - For iOS simulator testing (macOS only)
- **Postman** - For API endpoint testing and documentation
- **MongoDB Compass** - For database visualization and management

## 🚀 Installation & Setup

### Step 1: Repository Initialization

```bash
git clone <repository-url>
cd my-shopping-app-main
```

### Step 2: Backend Configuration

Initialize the backend service with required dependencies and environment configuration:

```bash
cd backend
npm install
```

**Verify installation:**
```bash
npm list
```

### Step 3: Frontend Configuration

Initialize the frontend application with Expo and React Native dependencies:

```bash
cd ../work
npm install
```

**Verify installation:**
```bash
expo --version
npm list
```

### Step 4: Environment Configuration

Create environment configuration files as documented in the [Configuration](#configuration) section.

## ⚙️ Configuration

### Backend Environment Configuration

Create a `.env` file in the `backend/` directory with the following configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# API Configuration
API_URL=http://localhost:3000
API_VERSION=v1

# Authentication Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-min-32-chars
JWT_EXPIRATION=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# CORS Configuration (comma-separated for multiple origins)
CORS_ORIGIN=http://localhost:19000,http://localhost:3000,http://localhost:8081

# Logging Configuration
LOG_LEVEL=debug
```

### Database Connection String

**MongoDB Atlas Setup** (Recommended for production):
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Set up database user with strong credentials
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/database`

**Local MongoDB Setup** (Development):
```
MONGODB_URI=mongodb://localhost:27017/shopping_app
```

### Frontend Configuration

Update `src/backend/firebaseConfig.js` with Firebase project credentials:

```javascript
// src/backend/firebaseConfig.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export default firebaseConfig;
```

**Firebase Setup Instructions**:
1. Create project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Web app and copy config
4. Enable Firestore Database

### Environment Variable Security

- **Never** commit `.env` files to version control
- Use `.env.example` as template for developers
- Rotate sensitive keys periodically
- Use strong, randomly generated JWT secrets (minimum 32 characters)

## 🏃 Running the Application

### Backend Service Initialization

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Start the Express server**:
   ```bash
   npm start
   ```
   
   For development with automatic reload:
   ```bash
   npm run dev
   ```

3. **Verify server is running**:
   ```bash
   # Expected output:
   # 🍃 Connected to MongoDB
   # Server running on http://localhost:3000
   
   # Test API connectivity
   curl -X GET http://localhost:3000/api/products
   ```

4. **Common startup issues**:
   - Port 3000 in use: Change PORT in .env
   - MongoDB connection failed: Check MONGODB_URI in .env
   - CORS errors: Verify CORS_ORIGIN configuration

### Frontend Application Initialization

1. **Open new terminal and navigate to frontend**:
   ```bash
   cd work
   ```

2. **Start Expo development server**:
   ```bash
   npm start
   ```

3. **Platform Selection**:

   **Android Emulator**:
   ```bash
   # Press 'a' in terminal
   # Requires: Android Studio with configured emulator
   ```

   **iOS Simulator** (macOS only):
   ```bash
   # Press 'i' in terminal
   # Requires: Xcode with iOS simulator
   ```

   **Web Browser**:
   ```bash
   # Press 'w' in terminal
   # Opens: http://localhost:19000
   # Recommended for rapid development
   ```

   **Physical Device**:
   ```bash
   # Scan QR code with Expo Go app
   # Download: App Store / Play Store
   # Requires: Device on same network as dev machine
   ```

4. **Verify frontend connectivity**:
   - Web: Navigate to http://localhost:19000
   - Mobile: App appears on simulator/device
   - Check browser console for API errors

### Full-Stack Deployment

For complete system testing, run both services simultaneously:

**Terminal 1 - Backend Services**:
```bash
cd backend
npm start
# Verify: Server running on http://localhost:3000
```

**Terminal 2 - Frontend Application**:
```bash
cd work
npm start
# Select platform (w for web recommended)
```

**Verification Checklist**:
- ✅ Backend API responds to requests
- ✅ Frontend connects to API without CORS errors
- ✅ User can authenticate successfully
- ✅ Products load from database
- ✅ Cart functionality works locally
- ✅ Navigation between screens functions properly

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Available Endpoints

#### Products

**GET /products** - Get all products
```bash
curl -X GET http://localhost:3000/api/products
```
Response:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "image": "image-url",
    "category": "Electronics",
    "stock": 50
  }
]
```

**GET /products/:id** - Get product details
```bash
curl -X GET http://localhost:3000/api/products/507f1f77bcf86cd799439011
```

**POST /products** - Create new product (Admin only)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "New Product",
    "description": "Description",
    "price": 99.99,
    "image": "image-url",
    "category": "Electronics",
    "stock": 100
  }'
```

**PUT /products/:id** - Update product (Admin only)
```bash
curl -X PUT http://localhost:3000/api/products/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{ "price": 89.99, "stock": 75 }'
```

**DELETE /products/:id** - Delete product (Admin only)
```bash
curl -X DELETE http://localhost:3000/api/products/507f1f77bcf86cd799439011
```

#### Orders

**GET /orders** - Get user orders
```bash
curl -X GET http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**GET /orders/:id** - Get order details
```bash
curl -X GET http://localhost:3000/api/orders/507f1f77bcf86cd799439012
```

**POST /orders** - Create new order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "productId": "507f1f77bcf86cd799439011", "quantity": 2 }
    ],
    "totalPrice": 199.98,
    "shippingAddress": "123 Main St"
  }'
```

**PUT /orders/:id** - Update order status (Admin only)
```bash
curl -X PUT http://localhost:3000/api/orders/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -d '{ "status": "shipped" }'
```

#### Authentication

**POST /auth/register** - Register new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe"
  }'
```

**POST /auth/login** - Login user
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```
Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**POST /auth/logout** - Logout user
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📝 Project Structure

### Directory Organization

```
my-shopping-app/
│
├── backend/                              # Express.js Server
│   ├── models/
│   │   ├── Product.js                   # Product schema and validations
│   │   ├── Order.js                     # Order model with order items
│   │   ├── User.js                      # User authentication model
│   │   └── Category.js                  # Product category model
│   │
│   ├── routes/                          # API endpoint definitions
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── middleware/                      # Custom middleware functions
│   │   ├── authMiddleware.js            # JWT verification
│   │   ├── errorHandler.js              # Global error handling
│   │   ├── validate.js                  # Input validation
│   │   └── corsConfig.js                # CORS configuration
│   │
│   ├── controllers/                     # Business logic layer
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── authController.js
│   │   └── userController.js
│   │
│   ├── utils/                           # Utility functions
│   │   ├── logger.js                    # Logging utilities
│   │   ├── validators.js                # Data validation helpers
│   │   └── errorMessages.js             # Centralized error messages
│   │
│   ├── server.js                        # Express app initialization
│   ├── config.js                        # Configuration management
│   ├── package.json
│   ├── .env                             # Environment variables (create this)
│   ├── .env.example                     # Environment template
│   ├── .gitignore
│   └── README.md
│
├── work/                                # React Native (Expo) Frontend
│   ├── src/
│   │   └── backend/
│   │       ├── firebaseConfig.js        # Firebase initialization
│   │       │
│   │       └── frontend/
│   │           │
│   │           ├── screens/             # Screen components
│   │           │   ├── Mainpage.js
│   │           │   ├── ProductScreen.js
│   │           │   ├── ProductDetailsScreen.js
│   │           │   ├── CartScreen.js
│   │           │   ├── CheckoutScreen.js
│   │           │   ├── LoginScreen.js
│   │           │   ├── RegisterScreen.js
│   │           │   ├── OrderTrackingScreen.js
│   │           │   └── AdminDashboard.js
│   │           │
│   │           ├── context/             # Context API state management
│   │           │   ├── CartContext.js
│   │           │   ├── ProductContext.js
│   │           │   ├── UserContext.js
│   │           │   └── OrderContext.js
│   │           │
│   │           ├── components/          # Reusable components
│   │           │   ├── ProductCard.js
│   │           │   ├── CartItem.js
│   │           │   ├── Header.js
│   │           │   ├── Footer.js
│   │           │   └── LoadingSpinner.js
│   │           │
│   │           ├── services/            # API service layer
│   │           │   ├── apiClient.js     # Axios instance and interceptors
│   │           │   ├── productService.js
│   │           │   ├── authService.js
│   │           │   └── orderService.js
│   │           │
│   │           └── index.js             # Component exports
│   │
│   ├── App.js                           # Main app component
│   ├── index.js                         # Entry point
│   ├── app.json                         # Expo configuration
│   ├── package.json
│   ├── test_react.js                    # React component tests
│   ├── test_resolve.js                  # Module resolution tests
│   ├── assets/                          # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── .gitignore
│   └── README.md
│
├── check_db.js                          # Database connection utility
├── .gitignore
└── README.md                            # This documentation
```

### Code Organization Principles

- **Separation of Concerns** - Each layer (routes, controllers, services) has distinct responsibility
- **Modularity** - Components and utilities are self-contained and reusable
- **Scalability** - Structure supports adding new features without major refactoring
- **Maintainability** - Clear naming conventions and logical grouping

## 💻 Code Quality & Best Practices

### Frontend Best Practices

**State Management**
```javascript
// ✅ Using Context API with custom hooks
const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

// Usage in components
const { cart, addToCart, removeFromCart } = useCart();
```

**Component Composition**
```javascript
// ✅ Functional components with hooks
const ProductCard = ({ product, onAddToCart }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAdd = useCallback(async () => {
    setIsLoading(true);
    await onAddToCart(product.id);
    setIsLoading(false);
  }, [product.id, onAddToCart]);
  
  return <View>{/* JSX */}</View>;
};
```

**Error Boundaries**
- Implement error boundaries for screen-level components
- Use try-catch for API calls
- Display user-friendly error messages

**Performance Optimization**
- Use `React.memo()` for expensive components
- Implement `useCallback()` for event handlers
- Lazy load images using React Native Image
- Minimize re-renders through proper dependency arrays

### Backend Best Practices

**Error Handling Pattern**
```javascript
// ✅ Centralized error handling
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  console.error(`[${new Date().toISOString()}] ${status}: ${message}`);
  
  res.status(status).json({
    error: message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
});
```

**Input Validation**
```javascript
// ✅ Middleware-level validation
const validateProduct = (req, res, next) => {
  const { name, price, description } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Product name is required' });
  }
  
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Valid price is required' });
  }
  
  next();
};

app.post('/products', validateProduct, createProduct);
```

**Database Query Optimization**
```javascript
// ✅ Efficient queries with indexing
const getProductsByCategory = async (category) => {
  return await Product.find({ category })
    .select('name price image category')
    .limit(50)
    .exec();
};

// Create indexes in MongoDB
Product.collection.createIndex({ category: 1 });
Product.collection.createIndex({ name: 'text' });
```

**Authentication Implementation**
```javascript
// ✅ JWT-based authentication
const generateToken = (userId) => {
  return jwt.sign(
    { userId, timestamp: Date.now() },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || '7d' }
  );
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Token required' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```

## 📊 Performance Optimization

### Frontend Performance

| Optimization | Implementation | Impact |
|--------------|-----------------|--------|
| **Code Splitting** | Lazy load screens with React Navigation | Reduce initial bundle |
| **Memoization** | React.memo() on list items | Prevent unnecessary re-renders |
| **Image Optimization** | Use optimized image sizes and formats | Reduce memory footprint |
| **Async Storage Caching** | Cache API responses locally | Faster app load times |
| **Bundle Analysis** | Monitor bundle size | Keep app lightweight |

### Backend Performance

```javascript
// Database Query Optimization
// ❌ Inefficient
const products = await Product.find();
const categorized = products.map(p => ({ ...p, category: ... }));

// ✅ Efficient
const products = await Product.find().select('name price category').limit(100);
```

**Caching Strategy**:
- Implement response caching headers
- Use ETags for conditional requests
- Cache frequently accessed data (Redis)

**Database Indexing**:
```javascript
// Add indexes on frequently queried fields
productSchema.index({ category: 1 });
productSchema.index({ name: 'text' });
productSchema.index({ createdAt: -1 });
```

## 🔐 Security Implementation

### Frontend Security

**Secure Storage**
- Store tokens in secure AsyncStorage only
- Clear sensitive data on logout
- Use HTTPS for API calls
- Implement certificate pinning (production)

**Input Sanitization**
```javascript
// ✅ Validate user input
const sanitizeInput = (input) => {
  return input.trim().replace(/[<>]/g, '');
};
```

### Backend Security

**Authentication & Authorization**
- Implement JWT with short expiration times
- Use refresh tokens for session renewal
- Enforce role-based access control (RBAC)
- Rate limit login attempts

**API Security**
```javascript
// ✅ Secure API configuration
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
};

app.use(securityHeaders);
```

**Database Security**
- Use strong MongoDB credentials
- Enable IP whitelisting
- Encrypt sensitive data fields
- Regular database backups

**Environment Variables**
- Never commit `.env` files
- Use `.env.example` as template
- Rotate secrets periodically
- Use different credentials per environment

## 🧪 Testing

### Frontend Unit Tests

```bash
cd work
npm test
```

Run specific test suite:
```bash
npm test test_react.js
npm test test_resolve.js
```

### Backend API Testing

**Using Curl**:
```bash
# Test GET endpoint
curl -X GET http://localhost:3000/api/products

# Test POST endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

**Using Postman**:
1. Import API endpoints
2. Set environment variables
3. Create test collections
4. Run automated test suites

**Using Jest** (recommended setup):
```bash
npm install --save-dev jest supertest

# Create test files
mkdir backend/__tests__

# Run tests
npm test
```

Example test:
```javascript
const request = require('supertest');
const app = require('../server');

describe('GET /api/products', () => {
  it('should return all products', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

## 🤝 Contributing

We welcome contributions from developers. Please follow these guidelines:

### Development Workflow

1. **Fork the repository** and create a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Follow Code Standards**
   - Use consistent naming conventions
   - Write clean, well-commented code
   - Follow project structure
   - Add error handling

3. **Commit Best Practices**
   ```bash
   git commit -m "feat: add amazing feature"
   # Use conventional commits:
   # feat: new feature
   # fix: bug fix
   # docs: documentation
   # refactor: code refactoring
   # test: testing changes
   ```

4. **Push and Create Pull Request**
   ```bash
   git push origin feature/amazing-feature
   ```

### Pull Request Requirements

- [ ] Code follows project style guide
- [ ] Tests are included for new features
- [ ] Commit messages follow conventions
- [ ] No hardcoded secrets or API keys
- [ ] Documentation is updated
- [ ] All tests passing locally

### Code Review Process

- Maintainers review PRs within 48-72 hours
- Address feedback promptly
- Ensure all CI/CD checks pass
- Merge only after approval

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

Permissions:
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

Conditions:
- 📋 License and copyright notice must be included

## 📧 Support & Contact

For support, documentation, or questions:

- **GitHub Issues**: Report bugs and feature requests
- **Email**: [your-email@example.com]
- **Documentation**: See [CONTRIBUTING.md](./CONTRIBUTING.md)

## 🎓 Learning Resources

### Documentation
- [Express.js Documentation](https://expressjs.com/)
- [React Native Documentation](https://reactnative.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Expo Documentation](https://docs.expo.dev/)

### Tutorials
- JWT Authentication in Node.js
- React Native Navigation Patterns
- MongoDB Indexing and Optimization
- RESTful API Design Principles

### Tools & Resources
- [Postman API Testing](https://www.postman.com/)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [Expo Snack](https://snack.expo.dev/)
- [REST Client VS Code Extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

## 🗺️ Roadmap

### Current Version (v1.0.0)
- ✅ Core e-commerce functionality
- ✅ User authentication system
- ✅ Product catalog management
- ✅ Shopping cart implementation
- ✅ Basic order tracking

### Upcoming Features (v2.0.0)
- [ ] **Payment Integration** - Stripe/PayPal gateway integration
- [ ] **Advanced Search** - Elasticsearch implementation
- [ ] **Product Reviews** - Rating and review system
- [ ] **Wishlist Feature** - Save favorite products
- [ ] **Push Notifications** - Real-time order updates
- [ ] **Analytics Dashboard** - Sales and user analytics
- [ ] **Recommendation Engine** - ML-based product recommendations
- [ ] **Multi-Currency Support** - International payments

### Future Enhancements (v3.0.0)
- [ ] **Microservices Architecture** - Service decomposition
- [ ] **GraphQL API** - Alternative to REST
- [ ] **Real-time Chat** - Customer support chat
- [ ] **Inventory Management** - Advanced stock tracking
- [ ] **Marketplace** - Multi-vendor support
- [ ] **Mobile App** - Native iOS/Android apps
- [ ] **Voice Commerce** - Voice-based shopping

## 📈 Project Metrics

- **Code Quality**: Enterprise-grade error handling and logging
- **Performance**: Optimized database queries and caching
- **Security**: JWT authentication, input validation, CORS protection
- **Scalability**: Modular architecture supporting horizontal scaling
- **Maintainability**: Clear code structure and comprehensive documentation
- **Test Coverage**: Unit and integration tests for critical paths

## 🙏 Acknowledgments

- Built with modern React Native and Express.js practices
- Community contributions and feedback
- Open-source libraries and frameworks

---

**Version**: 1.0.0  
**Last Updated**: August 2026  
**Maintainers**: Development Team

**Happy Coding!** 💻✨
