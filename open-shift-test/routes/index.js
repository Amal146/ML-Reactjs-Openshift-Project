const express = require('express');
const router = express.Router();
const { pgconn } = require('../db/config');


/* Show home page. */
router.get('/', function(req, res) {
  // We first check if the 'wheat_diseases' table exists
  pgconn.query("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wheat_diseases')", function(err, results) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database connection failure! ' + err.stack, diseases: null });
    }

    // 'wheat_diseases' table does not exist. Send empty data.
    else if (results.rows[0].exists == false) {
      return res.status(200).json({ error: null, diseases: [] });
    }

    // 'wheat_diseases' table exists. Show the records.
    else {
      pgconn.query('SELECT * FROM wheat_diseases', function(err, results) {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Database connection failure! ' + err.stack, diseases: null });
        }
        else {
          let diseases = results.rows;
          console.log(diseases);
          return res.status(200).json({ error: null, diseases: diseases });
        }
      });
    }
  });
});

/* Seed test data */
router.post('/seed', function(req, res) {
  // Drop 'wheat_diseases' table if not already exists, and seed some test data
  pgconn.query("CREATE TABLE IF NOT EXISTS public.wheat_diseases (id integer NOT NULL DEFAULT nextval('wheat_diseases_id_seq'::regclass), disease_name character varying(255) COLLATE pg_catalog.'default' NOT NULL, symptom_1 character varying(255) COLLATE pg_catalog.'default' NOT NULL, symptom_2 character varying(255) COLLATE pg_catalog.'default' NOT NULL, symptom_3 character varying(255) COLLATE pg_catalog.'default' NOT NULL, CONSTRAINT wheat_diseases_pkey PRIMARY KEY (id)); INSERT INTO wheat_diseases (disease_name, symptom_1, symptom_2, symptom_3) VALUES ('Leaf Rust', 'Orange-red pustules on leaves', 'Stunted plant growth', 'Leaf curling and drying'), ('Stem Rust', 'Dark red elongated pustules on stems', 'Stem weakening and breakage', 'Grain shriveling'), ('Powdery Mildew', 'White powdery fungal spots on leaves', 'Progressive leaf drying and yellowing', 'Reduced plant vigor');", function(err, results) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Seeding database failure! ' + err.stack });
    }

    // Send success response
    return res.status(200).json({ message: 'Database seeded successfully!' });
  });
});

module.exports = router;
