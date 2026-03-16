# Neural Nexus Backend

A robust backend API for Neural Nexus team built with Node.js, Express.js, TypeScript, and PostgreSQL. This API provides comprehensive user management, subscription handling.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (USER, ADMIN, SUPER_ADMIN)
- **User Management**: Complete user registration, email verification, profile management with image upload
- **File Upload**: Image upload functionality with Cloudinary integration
- **Email Services**: Automated email notifications using Brevo SMTP for verification and password reset
- **Database Management**: PostgreSQL with Prisma ORM for type-safe database operations
- **Error Handling**: Comprehensive error handling with custom error classes and validation
- **Security**: Password hashing with bcrypt, JWT tokens, request validation, and CORS configuration
- **Super Admin Seeding**: Automatic super admin creation on application startup

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Email Service**: Brevo (formerly Sendinblue) SMTP
- **Validation**: Zod for request validation
- **Development**: ts-node-dev, ESLint

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- pnpm (preferred package manager) or npm
- Cloudinary account for file uploads (optional)
- Brevo (formerly Sendinblue) account for email services (optional)

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/shariful10/backend_starter_pack_with_postgres.git
   cd backend_starter_pack_with_postgres
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/neural_nexus"

   # Server Configuration
   NODE_ENV=development
   PORT=5005
   HOST=localhost

   # JWT Configuration
   JWT_ACCESS_SECRET=your_jwt_access_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   JWT_ACCESS_EXPIRES_IN=2y
   JWT_REFRESH_EXPIRES_IN=5y
   JWT_RESET_PASS_ACCESS_EXPIRES_IN=5m

   # Brevo Email Configuration (formerly Sendinblue)
   BREVO_EMAIL=your_brevo_smtp_email
   BREVO_PASS=your_brevo_smtp_password
   EMAIL_FROM=your_sender_email@domain.com


   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Super Admin Configuration
   SUPER_ADMIN_EMAIL=superadmin@example.com
   SUPER_ADMIN_PASSWORD=your_super_admin_password

   # URL Configuration
   RESET_PASS_UI_LINK=http://localhost:3000/reset-password
   BACKEND_URL=http://localhost:5005/api/v1
   IMAGE_URL=http://localhost:5005
   FRONTEND_URL=http://localhost:3000
   VERIFY_EMAIL_LINK=http://localhost:5005/api/v1/auth/verify-email
   VERIFY_RESET_PASS_LINK=http://localhost:5005/api/v1/auth/verify-reset-password
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # Migration note for OTP fields:
   # A migration has been created at `prisma/migrations/20251226100000_add_otp_fields/migration.sql` which adds OTP-related columns to the `users` table (and an enum type `OPTPurpose`).
   # To apply it, run `npx prisma migrate deploy` (or `npx prisma migrate dev` in development). Review the SQL before applying.

   # Seed the database (creates super admin automatically)
   yarn dev
   ```

## 🚀 Running the Application

### Development Mode

```bash
yarn dev
```

### Production Build

```bash
yarn build
yarn start
```

### Developer commands

Run lint, tests and typecheck locally:

```bash
pnpm lint
pnpm test
pnpm typecheck
# CI command (runs lint, tests, typecheck)
pnpm run ci
```

### Using Docker

1. Create an `.env` from the provided `.env.example` and set required variables (DATABASE*URL, JWT*_ secrets, SUPER*ADMIN*_).

2. Build and start services:

```bash
docker-compose up -d --build
```

The server will start on `http://localhost:5005`.

Notes:

- `docker-compose` uses the application's `.env` file via `env_file` so make sure it is present.
- The container includes a healthcheck; check status with `docker ps` or `docker-compose ps`.
- The app runs automatic seeding on startup (super admin). If you do not want automatic seeding in some environments, set `DISABLE_AUTO_SEED=true` in your `.env` before starting.

- Email verification is OTP-based (no verification links). Use `/api/v1/auth/send-otp` and `/api/v1/auth/verify-otp` endpoints.

## 📁 Project Structure

```
src/
├── app/
│   ├── builder/          # Query builder utilities
│   ├── config/           # Configuration files
│   ├── errors/           # Error handling utilities
│   ├── helpers/          # Helper functions (password, JWT, OTP)
│   ├── interface/        # TypeScript interfaces
│   ├── middlewares/      # Express middlewares
│   ├── modules/          # Feature modules
│   │   ├── auth/         # Authentication module
│   │   └── user/         # User management
│   ├── routes/           # Route definitions
│   └── utils/            # Utility functions
├── prisma/               # Database schema and migrations
├── uploads/              # File upload directory
└── views/                # View templates
```

## 🔗 API Endpoints

### Authentication

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/send-otp` - Send verification OTP to email (body: { email, purpose: 'VERIFY' | 'RESET' })
- `POST /api/v1/auth/verify-otp` - Verify OTP and return access token (body: { email, otp, purpose })
- `POST /api/v1/auth/resend-otp` - Resend OTP (rate-limited)
- `PUT /api/v1/auth/change-password` - Change password (authenticated users)
- `POST /api/v1/auth/forgot-password` - Request password reset (sends an OTP)
- `POST /api/v1/auth/reset-password` - Reset password using OTP (body: { email, otp, newPassword, confirmPassword })

## Forms API

- `POST /api/v1/getInTouch` - Submit Get In Touch form (authenticated)
- `POST /api/v1/contact` - Submit Contact form (authenticated)
- `POST /api/v1/consultation` - Submit Consultation form (authenticated)
- `GET /api/v1/forms` - Retrieve forms with pagination and optional filter (authenticated)
- `GET /api/v1/forms/:userId` - Retrieve all forms submitted by a user (authenticated)
- `GET /api/v1/forms/stats` - Retrieve form submission stats per form type (Admin/Super Admin only)
- `GET /api/v1/auth/me` - Get current user info
- `POST /api/v1/auth/refresh-token` - Refresh JWT token

### Users

- `POST /api/v1/users/register` - User registration
- `GET /api/v1/users` - Get all users (Admin/Super Admin only)
- `GET /api/v1/users/:userId` - Get user by ID (Admin/Super Admin only)
- `PATCH /api/v1/users/update` - Update user profile with file upload
- `DELETE /api/v1/users/:userId` - Delete user (Admin/Super Admin only)

## 🗃️ Database Schema

### User Model

- User authentication and profile information
- Role-based access control (USER, ADMIN, SUPER_ADMIN)
- Email verification and password reset functionality

## 🔒 Authentication & Authorization

The API uses JWT-based authentication with robust security measures:

### **Token Security**

- **Dual Token System**: Separate access and refresh tokens with different secret keys
- **Token Expiration**:
  - Access tokens: 2 years (configurable)
  - Refresh tokens: 5 years (configurable)
  - Password reset tokens: 5 minutes (short-lived for security)
- **Token Validation**: Secure token verification on every protected route
- **Automatic Invalidation**: Tokens become invalid when passwords are changed

### **Role-Based Access Control**

- **USER**: Regular users with basic access to personal data and subscriptions
- **ADMIN**: Administrative users with extended permissions for user and plan management
- **SUPER_ADMIN**: Full system access including all administrative functions

### **Authentication Flow**

Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Token refresh is handled automatically through the `/api/v1/auth/refresh-token` endpoint.

## 📧 Email Services

- **Email Provider**: Brevo (formerly Sendinblue) SMTP service
- **Email Verification**: Automated email verification for new user registration
- **Password Reset**: Secure password reset functionality with time-limited tokens
- **Template System**: HTML email templates with branded design
- **Time Limits**: Email verification and password reset links expire in 10 minutes for security

## 🛡️ Security Features

- **Password Security**: Passwords are hashed using `bcryptjs` with salt rounds for secure storage
- **JWT Token Security**:
  - Separate access and refresh tokens with different secret keys
  - Configurable token expiration (Access: 2 years, Refresh: 5 years, Reset: 5 minutes)
  - Secure token generation and validation
  - Token-based authentication for all protected routes
  - Password change invalidates existing tokens
- **Request Validation**: Zod schema validation for all incoming requests
- **CORS Configuration**: Configured for specific frontend origins with credentials support
- **Role-Based Access**: Three-tier role system (USER, ADMIN, SUPER_ADMIN)
- **File Upload Security**: Secure file handling with Cloudinary integration
- **Email Security**: Time-limited verification and reset links (10-minute expiration)
- **Error Handling**: Comprehensive error handling without exposing sensitive information

## 🧪 Development

### Code Style

The project uses ESLint and TypeScript for code quality and type safety.

### Database Management

Use Prisma Studio to manage your database:

```bash
npx prisma studio
```

### Debugging

The application includes comprehensive error handling and logging for debugging purposes.

## License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Sk Shariful Islam**

- Email: sharifulisl96@gmail.com
