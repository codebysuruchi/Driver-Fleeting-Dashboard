export const startSimulator = (pool, io) => {
  console.log('Simulator started. Pushing events every 2-3 seconds.');

  setInterval(async () => {
    try {
      // Get an active trip randomly
      const [activeTrips] = await pool.query(
        "SELECT t.id as trip_id, t.driver_id, d.name as driver_name, d.risk_score FROM trips t JOIN drivers d ON t.driver_id = d.id WHERE t.status = 'active' ORDER BY RAND() LIMIT 1"
      );

      if (activeTrips.length === 0) return;

      const trip = activeTrips[0];

      // Determine event type randomly
      const rand = Math.random();
      let type = 'normal';
      let speed = Math.floor(Math.random() * 40) + 40; // 40-80 km/h

      if (rand > 0.85) {
        type = 'speeding';
        speed = Math.floor(Math.random() * 40) + 81; // 81-120 km/h
      } else if (rand > 0.70) {
        type = 'harsh_braking';
        speed = Math.floor(Math.random() * 20) + 20; // sudden drop
      } else if (rand > 0.60) {
        type = 'drowsiness';
      }

      // Insert event
      const [result] = await pool.query(
        'INSERT INTO events (trip_id, type, speed) VALUES (?, ?, ?)',
        [trip.trip_id, type, speed]
      );

      const eventData = {
        id: result.insertId,
        trip_id: trip.trip_id,
        driver_name: trip.driver_name,
        type,
        speed,
        timestamp: new Date()
      };

      // Broadcast new event
      io.emit('new_event', eventData);
      console.log(`Simulated Event: ${type} for ${trip.driver_name} at ${speed} km/h`);

      // Alert & Risk Score Logic
      // 1. Red Alert for speed > 80
      if (speed > 80) {
        io.emit('alert', {
          level: 'critical',
          message: `Overspeeding Alert! ${trip.driver_name} is driving at ${speed} km/h`,
          trip_id: trip.trip_id
        });
      }

      // 2. Risk score dynamic update (if >= 3 violations in current trip)
      const [violations] = await pool.query(
        'SELECT COUNT(*) as count FROM events WHERE trip_id = ? AND type != "normal"',
        [trip.trip_id]
      );

      if (violations[0].count >= 3 && violations[0].count % 3 === 0) {
        // Increase risk score by 5 for every 3 violations
        await pool.query('UPDATE drivers SET risk_score = risk_score + 5 WHERE id = ?', [trip.driver_id]);

        io.emit('alert', {
          level: 'warning',
          message: `Risk Score Increased! ${trip.driver_name} has multiple violations.`,
          driver_id: trip.driver_id
        });

        // Broadcast metrics update so dashboard updates total risk automatically
        io.emit('metrics_update');
      }

    } catch (error) {
      console.error('Simulator Error:', error);
    }
  }, Math.floor(Math.random() * 1000) + 2000); // 2-3 seconds
};
