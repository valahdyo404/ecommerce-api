# E-Commerce API

## Description
This project is an Project Backend Developer Test about Simple E-commerce API built with Node.js and Hapi.js, utilizing PostgreSQL for database management. It provides endpoints for managing products and transactions. The project includes robust error handling, input validation, and follows best practices for RESTful API design. The API can be run locally or using Docker Compose.

## How to Run the Project with Docker Compose

1. **Clone the Repository:**
   ```sh
   git clone https://github.com/your-username/ecommerce-api.git
   cd jubelio-microservice

2. **Build and Start the Containers:**
   ```sh
   sudo dockerd
   docker-compose up -v --build
   ```
3. **The API will be accessible at http://localhost:3000.**

## How to Run the Project Locally
*Adjust env database in src folder named .env*
1. **Clone the Repository:**

   ```sh
   git clone https://github.com/your-username/ecommerce-api.git
   cd jubelio-microservice
   npm install
   npm run migrate
   npm run start

2. **The API will be accessible at http://localhost:3000.**

## How to Run Tests
   ```sh
   git clone https://github.com/your-username/ecommerce-api.git
   cd microservice-ecommerce-api
   npm install
   npm test
   ```

## Project Package

- **@hapi/hapi**: Framework for building web applications and services.
- **@hapi/boom**: Library for proper error handling.
- **@hapi/joi**: Library for handle input validation more easily.
- **@hapi/jwt**: JWT authentication strategy plugin for Hapi.js.
- **axios**: HTTP client for making requests to external APIs.
- **bcrypt**: Library to help you hash password and validate password input.
- **dotenv**: Module for loading environment variables from a .env file.
- **laabr**: Plugin for logging api hitted in terminal in Hapi.js.
- **pg**: PostgreSQL client library for Node.js.


## API Docs
- **Postman**: https://documenter.getpostman.com/view/19880774/2sA3rxosqJ

