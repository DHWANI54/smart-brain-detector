import pkg from 'pg';

const { Pool } = pkg;

const db = new Pool({
  user: 'postgres',           
  host: 'localhost',         
  database: 'facerecognition',
  password: 'dhwani',         
  port: 5432                  
});

export default db;
