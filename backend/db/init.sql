CREATE DATABASE IF NOT EXISTS okdriver_fleet;
USE okdriver_fleet;

CREATE TABLE IF NOT EXISTS drivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  risk_score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  driver_id INT NOT NULL,
  status ENUM('active', 'completed') DEFAULT 'active',
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP NULL,
  FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  type VARCHAR(50) NOT NULL, -- e.g., 'speeding', 'harsh_braking', 'drowsiness'
  speed INT DEFAULT 0,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- Seed Initial Data
INSERT INTO drivers (name, risk_score) VALUES 
('Alice Sharma', 10),
('Bob Kumar', 5),
('Charlie Singh', 20),
('David Patel', 0);

-- Active Trips
INSERT INTO trips (driver_id, status) VALUES 
(1, 'active'),
(2, 'active'),
(3, 'active');
