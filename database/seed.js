import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'lms2026',
  database: 'capstone_interview'
};

async function seedDatabase() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MariaDB database');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    await connection.execute(`
      INSERT IGNORE INTO users (email, password_hash, first_name, last_name, user_type, is_email_verified, is_active) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, ['admin@interview.com', adminPassword, 'Admin', 'User', 'admin', true, true]);

    // Create sample regular users
    const userPassword = await bcrypt.hash('user123', 12);
    await connection.execute(`
      INSERT IGNORE INTO users (email, password_hash, first_name, last_name, user_type, is_email_verified, is_active) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, ['nathanielinocando@aol.com', userPassword, 'Nathaniel', 'Inocando', 'user', true, true]);

    // Create premium user
    const premiumPassword = await bcrypt.hash('premium123', 12);
    await connection.execute(`
      INSERT IGNORE INTO users (email, password_hash, first_name, last_name, user_type, is_email_verified, is_active) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, ['premium@example.com', premiumPassword, 'Premium', 'User', 'premium', true, true]);

    // Get user IDs for sample data
    const [users] = await connection.execute('SELECT id, email FROM users WHERE email = ?', 
      ['nathanielinocando@aol.com']);

    if (users.length > 0) {
      const nathanielId = users[0].id;

      // Create sample interview sessions
      await connection.execute(`
        INSERT IGNORE INTO interview_sessions 
        (user_id, session_name, interview_type, job_role, company_name, status, overall_score, completed_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [nathanielId, 'Software Engineer Practice', 'technical', 'Software Engineer', 'Tech Corp', 'completed', 85.5, new Date()]);

      await connection.execute(`
        INSERT IGNORE INTO interview_sessions 
        (user_id, session_name, interview_type, job_role, status, overall_score, completed_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [nathanielId, 'Behavioral Interview', 'behavioral', 'Product Manager', 'completed', 78.0, new Date()]);
    }

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Sample Accounts Created:');
    console.log('┌─────────────────────────────┬──────────────┬──────────┐');
    console.log('│ Email                       │ Password     │ Role     │');
    console.log('├─────────────────────────────┼──────────────┼──────────┤');
    console.log('│ admin@interview.com         │ admin123     │ Admin    │');
    console.log('│ nathanielinocando@aol.com   │ user123      │ User     │');
    console.log('└─────────────────────────────┴──────────────┴──────────┘');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedDatabase();