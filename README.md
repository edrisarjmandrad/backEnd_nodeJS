## backEnd_nodeJS
🛍️ Simple User & Product Management API

## About
    A clean Node.js backend for managing users and products.
    Users can sign up, log in, and update their info.
    Admins can add, edit, and delete products.

## Features
    - Authentication with JWT 
    - Role-based access 
    - OTP flow 
    - Product CRUD 
    - Swagger API docs at /api-docs
    - Scheduled job to clean expired OTPs

## Tech Stack
    - Node.js, Express.js
    - MongoDB (mongoose for ORM)
    - JWT, bcrypt, multer, node-cron
    - Swagger for testing API

## Requirements
    - MongoDB connection string

## Getting Started
1. Clone
    git clone https://github.com/<your-username>/<your-repo-name>.git
    cd <your-repo-name>

2. Install
    npm install

3. Configure environment
    Create a `.env` file in the project root with:
        PORT=8080
        MONGODB_URI=mongodb://localhost:27017/your_db_name
        TOKEN_SECRET=your_jwt_secret

4. Run
    npm start

## API Documentation (Swagger)
    - Start the app and open: http://localhost:8080/api-docs
    - Get token for authorization from login , signup, validate_otp

## Authentication
    - Obtain a token from: `/api/login`, `/api/signUp`, or `/api/validate_otp`
    - Send the token in requests via header: `auth_token: <your_jwt_token>`

## Project Structure
    app.js                    Express app setup
    bin/www.js                Server config
    routes/routes.js          API routes
    controller/*.js           HTTP controllers
    services/*.js             Business logic
    models/*.js               DB access
    middleware/*.js           Auth, file upload
    configs/*.js              DB connections/config
    swagger.js                Swagger setup
    utils/*                   Helpers (e.g., email)

## Design Patterns
    - Singleton
    - Multi-layer architecture (Routes → Controller → Service → Model)
    - Validator pattern for input (`validation/*`)
    - Facade-style controllers
