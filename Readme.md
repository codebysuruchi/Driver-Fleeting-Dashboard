Live Fleet Monitoring Platform
This platform simulates live dashcam analytics, ingesting driver events and displaying them on a real-time dashboard.

Proposed Changes
We will create two main directories inside c:/Ayush's/Projects/Tasks/Driver Fleeting Dashboard: backend and frontend.

Database Schema (MySQL)
Three main tables:

drivers (id, name, risk_score)
trips (id, driver_id, start_time, end_time, status)
events (id, trip_id, type (e.g., speeding, braking, drowsiness), timestamp, metadata)
Backend (Node.js/Express)
server.js: Main Express app, connects to MySQL, initializes Socket.io on the HTTP server.
routes/api.js: Handles REST endpoints (e.g., getting historical data, managing drivers).
services/simulator.js: Runs an interval strictly every 2-3 seconds to generate random events (speeding, harsh braking) for active trips. Checks logic:
If speed > 80kmph => trigger "red alert" over WebSocket.
If >= 3 violations in a single trip => Increment driver's risk score and broadcast update.
db/init.sql: SQL script to initialize tables and insert seed data.
Frontend (React + Vite)
UI built with modern sleek aesthetics (TailwindCSS or modular vanilla CSS, using Chart.js or Recharts).
Main View:
Header: Branding and connection status.
Video Section: Embedded YouTube live stream iframe simulating a dashcam.
Metrics Row: Total Trips, Live Drivers, Violation Count, Average Risk Score.
Live Alerts Section: Scrolling list of real-time alerts. Red cards for speed > 80kmph.
Charts: Driver risk scores and event frequency distributions.
Verification Plan
Automated Tests
Test API endpoints with curl/Postman (or programmatic fetch) to ensure data is returned and ingested.
Manual Verification
Start backend, ensure Simulator pushes data via WS.
Open frontend, verify WS connection.
Wait and observe automatic updates of alerts without page refresh.
Check that 3 violations update the corresponding risk score dynamically.