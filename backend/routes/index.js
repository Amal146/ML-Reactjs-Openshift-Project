const express = require('express');
const router = express.Router();
const { pgconn } = require('../db/config');

/* Show home page. */
router.get('/', function(req, res) {
  // Check if the 'wheat_diseases' table exists
  pgconn.query("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wheat_diseases')", function(err, results) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database connection failure! ' + err.stack, diseases: null });
    }

    // 'wheat_diseases' table does not exist, so create it
    if (results.rows[0].exists == false) {
      // Create 'wheat_diseases' table and seed data
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS public.wheat_diseases (
          id SERIAL PRIMARY KEY,
          disease_name VARCHAR(255) NOT NULL,
          symptom_1 VARCHAR(255) NOT NULL,
          symptom_2 VARCHAR(255) NOT NULL,
          symptom_3 VARCHAR(255) NOT NULL
        );
      `;
      const seedDataQuery = `
        INSERT INTO wheat_diseases (disease_name, symptom_1, symptom_2, symptom_3) 
        VALUES 
          ('Leaf Rust', 'Orange-red pustules on leaves', 'Stunted plant growth', 'Leaf curling and drying'),
          ('Stem Rust', 'Dark red elongated pustules on stems', 'Stem weakening and breakage', 'Grain shriveling'),
          ('Powdery Mildew', 'White powdery fungal spots on leaves', 'Progressive leaf drying and yellowing', 'Reduced plant vigor'),
          ('Wheat Yellow Rust', 'Yellow streaks on leaves', 'Reduced grain yield', 'Green tissue drying'),
          ('Bacterial Blight', 'Water-soaked lesions on leaves', 'Leaf wilting', 'Yellowing around lesions'),
          ('Fusarium Head Blight', 'Bleached heads', 'Shriveled kernels', 'Pink or reddish discoloration on grains')
        ON CONFLICT DO NOTHING;
      `;
      pgconn.query(createTableQuery + seedDataQuery, function(err, results) {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Table creation or seeding failed! ' + err.stack });
        }

        // Return success response after creating table and seeding data
        return res.status(200).json({ error: null, diseases: [] });
      });
    } else {
      // 'wheat_diseases' table exists, fetch the records
      pgconn.query('SELECT * FROM wheat_diseases', function(err, results) {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Database connection failure! ' + err.stack, diseases: null });
        } else {
          let diseases = results.rows;
          return res.status(200).json({ error: null, diseases: diseases });
        }
      });
    }
  });
});




module.exports = router;
