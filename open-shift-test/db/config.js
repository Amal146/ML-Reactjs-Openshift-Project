require('dotenv').config();
const DB_CONFIG = process.env.DB_CONFIG || 'postgresql://postgres:system@localhost:5432/wheat_diseases';
const { Pool } = require('pg');

const pgconn = new Pool({
    connectionString: DB_CONFIG,
    ssl: false,
});
  
module.exports = { pgconn }