import pg from 'pg';
import process from 'node:process';

const { Pool } = pg;

console.log(process.env.DB_USER,
process.env.DB_HOST, 
process.env.DB_NAME,
process.env.DB_PASS,
process.env.DB_PORT)




  
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST, 
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT
});

// Probar la conexión
pool.connect()
  .then(client => {
    console.log('PostgreSQL Connected!'); 
    client.release(); 
  })
  .catch(err => console.error('Error de conexión', err.stack));

export default pool;
