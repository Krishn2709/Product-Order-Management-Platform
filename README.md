# Online Product & Order Management Platform

This is an **Online Product & Order Management Platform** developed using **React**  for the frontend, and **PostgreSQL** for the backend. The platform allows users to browse products, manage a shopping cart, and place orders. Admin users can manage products and view and edit order statuses.

## Features

### User Features:
- **Product Browsing:** Users can browse products, search by categories, tags, or price.
- **Cart Management:** Users can add products to the cart, update quantities, and remove items.
- **Checkout & Order Placement:** Users can view their cart summary and place an order.
  
### Admin Features:
- **Product Management:** Admin can view all products, including inactive or deleted products, and update product details.
- **Order Management:** Admin can view, confirm, or edit order statuses.

## Tech Stack

- **Frontend:**
  - React.js
  - React Router for navigation
  - CSS for styling
  
- **Backend:**
  - Node.js with Express.js
  - PostgreSQL for database storage
  - JWT for user authentication
  
- **Deployment:**
  - Frontend and Backend can be deployed separately (Vercel for frontend, Heroku for backend or any other preferred hosting).

## Setup Instructions

### Frontend Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/online-product-order-management.git
   cd online-product-order-management
Install dependencies:

bash
Copy
Edit
npm install
Start the development server:

bash
Copy
Edit
npm start
The application will be available at http://localhost:3000.

Backend Setup
Clone the repository (if not done already):


git clone https://github.com/your-username/online-product-order-management.git
cd online-product-order-management/backend
Install dependencies:

npm install
Set up PostgreSQL:

Make sure PostgreSQL is installed and running.
Create a database named product_order_management.
Create tables using the SQL migration files provided in the backend folder.
Start the backend server:

npm start
The backend will be available at http://localhost:5000.

Environment Variables
You need to create a .env file for the backend to store sensitive data:

DATABASE_URL=your-database-connection-url
JWT_SECRET=your-jwt-secret-key
