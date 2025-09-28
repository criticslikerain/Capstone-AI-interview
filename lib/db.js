import mysql from 'mysql2/promise';

//*******************************************************************
// DATABASE CONFIG DIRI - IMPORTANT KAAYO NI!
// Kung naa kay environment variables gamiton nato, kung wala default
// Ayaw kaayo usaba ni kay mag guba ang database connection
//*******************************************************************
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'capstone_interview',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'lms2026',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;

/**********************************************************************
// POOL CREATION - DIRI TA MAGHIMO UG CONNECTION POOL
// Para dili ta sige ug create ug connection kada query
// Mag reuse nalang ta ug connection para mas paspas
**********************************************************************/
export const getPool = () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
};

//*******************************************************************
// QUERY FUNCTION - DIRI TANAN QUERIES MO AJI
// Mao ni gamiton kung mangutana ta sa database
// Naa ni error handling para dili ma crash ang system
//*******************************************************************
export const query = async (sql, params = []) => {
  const connection = getPool();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export default getPool;