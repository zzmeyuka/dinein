# dinein
## Project Overview
Dine-In is a restaurant management application that allows users to place orders, view menu items, and manage their profiles. The application features user authentication, role-based access control, and a modular structure for easy maintenance and scalability.

Features

Real-time order management and tracking
Dynamic menu management with instant updates
Role-based access control
Secure JWT authentication
Responsive dashboard interface

Tech Stack

Database: MongoDB
Backend: Express.js
Authentication: JWT
Security: bcrypt for password hashing
Real-time Updates: WebSocket integration

System Architecture
Dinein follows the MVC (Model-View-Controller) pattern:

Model: Handles data logic and MongoDB interactions
View: User interface for staff and customers
Controller: Processes requests and manages business logic

Key Features
Menu Management

Real-time menu updates
Dynamic pricing
Category management
Item availability tracking

Order Processing

Real-time order status updates
Order tracking system
Multiple status stages (new, preparing, ready)
Order history tracking

Security Features

JWT-based authentication
Role-based access control
Password encryption
Data encryption at rest
Secure API endpoints

Performance Features

MongoDB indexing optimization
Horizontal scaling through sharding
Efficient query optimization
Real-time data processing

## Setup Instructions
1. **Clone the repository**:
   ```bash
   git clone <[repository-url](https://github.com/zzmeyuka/dinein.git)>
   cd dinein
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following:
   ```
   MONGO_URI=mongodb+srv://uldanarahmetova:eklfyf06@cluster0.69h7b.mongodb.net/dine-in?authSource=admin
   DB_NAME=dine-in
   JWT_SECRET=your-secret-key
   PORT=5000

   ```

4. **Run the application**:
   ```bash
   npm start
   ```

## API Documentation

### Authentication Endpoints
- **POST /api/users/register**
  - Registers a new user with encrypted passwords.
  
- **POST /api/users/login**
  - Authenticates users and returns a JWT.

### Menu Management Endpoints
- **GET /api/menu**
  - Retrieve menu items
- **POST /api/menu**
  - Add new menu item (admin only)
- **DELETE /api/menu**
  - Remove menu item (admin only)

### Order Management Endpoints
- **GET /api/orders**
  - Retrieves all orders (admin only).

- **GET /api/orders/my-orders**
  - Retrieves orders for the logged-in user.

- **POST /api/orders**
  - Creates a new order for the logged-in user.

- **PATCH /api/orders/:id/status**
  - Updates the status of an order (admin only).


Team

Rakhmetova Uldana
Adilzhan Medetbekuly
Gulnaz Abzhapparova


MongoDB documentation and community
Node.js and Express.js documentation
