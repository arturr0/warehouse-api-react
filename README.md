# Warehouse Management System

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Express](https://img.shields.io/badge/Express-4.18.2-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0.5-green)
![Node.js](https://img.shields.io/badge/Node.js-16.x-orange)

A full-stack warehouse inventory management system with real-time visualization.

## Features

- **Product Management**
  - Create, read, update, and delete products
  - Track product quantities
  - Input validation and error handling

- **Inventory Control**
  - Increment/decrement product quantities
  - Prevent negative quantities
  - Automatic data seeding on first run

- **Data Visualization**
  - Interactive bar chart showing product quantities
  - Real-time updates when inventory changes
  - Responsive design

- **Backend API**
  - RESTful endpoints for all operations
  - MongoDB data storage
  - CORS support
  - Environment variable configuration

## Technologies Used

**Frontend:**
- React
- p5.js (for data visualization)
- Axios (for API calls)

**Backend:**
- Node.js
- Express
- MongoDB (with Mongoose)
- Body-parser
- CORS middleware
- Dotenv (for environment variables)
