# Driver Fleet Monitoring Dashboard

A real-time fleet monitoring dashboard that simulates driver behavior events such as speeding, harsh braking, and drowsiness. The system calculates driver risk scores and streams real-time data to a dashboard using WebSockets.

## Architecture Diagram
```
           +-------------------+
           |     User Browser  |
           +-------------------+
                     |
                     |
                     ▼
           +-------------------+
           | React Frontend    |
           | (Vite + Dashboard)|
           +-------------------+
                     |
                     | REST API
                     ▼
           +-------------------+
           | Node.js Backend   |
           | Express + Socket  |
           +-------------------+
             |              |
             |              |
             ▼              ▼
     +-------------+   +---------------+
     | Event       |   | MySQL         |
     | Simulator   |   | Database      |
     +-------------+   +---------------+
             |
             |
             ▼
      Real-time Events
       via Socket.IO
             |
             ▼
      Dashboard Updates
```

## Project Overview

This project simulates a fleet monitoring system where vehicles and drivers generate driving events in real time. The backend processes these events, stores them in a database, and sends updates to the frontend dashboard.

Key capabilities include:

- Real-time event simulation
- Driver risk score calculation
- Live updates using WebSockets
- Fleet trip monitoring
- Event storage and analytics

## Tech Stack

Frontend:
- React (Vite)
- Socket.IO Client
- Axios

Backend:
- Node.js
- Express.js
- Socket.IO
- dotenv

Database:
- MySQL

Libraries:
- mysql2
- cors
- nodemon

---

## Project Structure

```
driver-fleet-dashboard
│
├── backend
│ ├── db
│ │ └── init.js
| |
│ ├── services
│ │ └── simulator.js
│ │
│ ├── server.js
│ └── .env
│
├── frontend
│ ├── src
│ │ ├── components
│ │ ├── pages
│ │ ├── App.jsx
│ │ └── main.jsx
│ │
│ └── package.json
│
└── README.md
```


---

## Installation

### Clone the Repository
```
git clone https://github.com/your-username/driver-fleet-dashboard.git

cd driver-fleet-dashboard
```


---

## Backend Setup

Navigate to backend folder:
```
cd backend
```

```
Install dependencies:
```


npm install

- Install required packages if missing:

```
npm install express mysql2 cors socket.io dotenv nodemon
```


---

## Environment Variables

Create a `.env` file inside backend folder.

Example:

```
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=okdriver_fleet
```


---

## Database Setup (MySQL)

Open MySQL Workbench and run the following queries.

### Create Database
```
CREATE DATABASE okdriver_fleet;
USE okdriver_fleet;
```


---

### Create Drivers Table
```
CREATE TABLE drivers (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
phone VARCHAR(15),
risk_score INT DEFAULT 0
);
```

---

### Create Trips Table
```
CREATE TABLE trips (
id INT AUTO_INCREMENT PRIMARY KEY,
driver_id INT,
vehicle_id INT,
status VARCHAR(50),
start_time DATETIME,
end_time DATETIME,
FOREIGN KEY (driver_id) REFERENCES drivers(id)
);
```


---

### Create Events Table
```
CREATE TABLE events (
id INT AUTO_INCREMENT PRIMARY KEY,
trip_id INT,
type VARCHAR(50),
speed INT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (trip_id) REFERENCES trips(id)
);
```


---

### Insert Sample Drivers
```
INSERT INTO drivers (name, phone, risk_score)
VALUES
('Ramesh Kumar','9876543210',20),
('Suresh Patel','9876543211',15),
('Amit Singh','9876543212',10);
```


---

### Insert Sample Trips
```
INSERT INTO trips (driver_id, vehicle_id, status, start_time)
VALUES
(1,101,'active',NOW()),
(2,102,'active',NOW()),
(3,103,'active',NOW());
```

---

## Running the Backend

Start the server using nodemon:
```
nodemon server.js
```


Expected output:
```
Server running on port 5000
MySQL Connected
Simulator Started
Client connected
```


---

## Frontend Setup

Navigate to frontend folder:
```
cd frontend
```


Install dependencies:
```
npm i 
```


Run the development server:
```
npm run dev
```


Vite will start the app at:
```
http://localhost:5173
```


---

## Event Simulation

The simulator generates random driver events such as:

- speeding
- harsh_braking
- drowsiness
- normal driving

Example simulated event:
```
{
trip_id: 1,
type: "speeding",
speed: 82
}
```


These events are stored in the database and pushed to the dashboard in real time.

---

## Features

- Real-time driver behavior simulation
- Risk score calculation
- WebSocket-based live dashboard updates
- MySQL event storage
- Driver and trip monitoring

---

## Future Improvements

- Map-based vehicle tracking
- Advanced risk scoring algorithm
- Driver performance analytics
- Admin dashboard
- Alert notifications for dangerous events

---


## Author

Suruchi Jha

---


