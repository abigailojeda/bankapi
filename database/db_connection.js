import pg from 'pg';
import process from 'node:process';

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST, 
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT, 
});

// Probar la conexión
pool.connect()
  .then(client => {
    console.log('PostgreSQL Connected!'); 
    client.release(); 
  })
  .catch(err => console.error('Error de conexión', err.stack));

export default pool;
