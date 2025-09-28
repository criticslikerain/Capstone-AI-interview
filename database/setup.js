import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'lms2026',
  multipleStatements: true
};

async function setupDatabase() {
  let connection;
  
  //***************************************************************
  // YO! SETUP SA DATABASE NI DIRI! AYAW HILABTI KUNG DILI EXPERT!
  // Mari ta tawag sa Maria(DB) para tabangan ta setup! 
  //***************************************************************
  try {
    //* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    //* MYSQL CONNECTION FIRST! 
    //* Wala pa ta specific database kay bag-o pa ni sya na baby 
    //* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    connection = await mysql.createConnection(dbConfig);
    
    console.log('Connected to MariaDB server');
    
    //**************************************************
    //** MAGHIMO TAG DATABASE KUNG WALA PA!
    //** Mura ni siyag create new folder sa db 
    //**************************************************
    await connection.execute('CREATE DATABASE IF NOT EXISTS capstone_interview');
    console.log('Database created or already exists');
    
    // Use the database
    await connection.execute('USE capstone_interview');
    console.log('Using capstone_interview database');
    
    //*********************************************************
    //* KANI NA PART DELIKADO! SCHEMA SETUP NA NI!!!
    //* Basahon nato ang schema.sql para ma setup ang tables 
    //* Kung ma mali ni, ma guba tanan! Pagbantay! 
    //*********************************************************
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements and execute
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement);
        } catch (error) {
          //*****************************************************
          //* YAWA! NAA ERROR! pero ok ra ni kung existing na XD
          //* Mura rag nag create ka folder nga naa na daan LOL
          //*****************************************************
          if (!error.message.includes('already exists') && 
              !error.message.includes('Duplicate entry')) {
            console.warn('Warning:', error.message);
          }
        }
      }
    }
    
    console.log('Database schema setup completed successfully!');
    console.log('You can now run: npm run dev');
    
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();