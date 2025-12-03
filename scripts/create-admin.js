const bcryptjs = require('bcryptjs');
const Database = require('better-sqlite3');
const path = require('path');

async function createAdmin() {
  const email = 'muzahaircz@gmail.com';
  const password = 'muzaisthebest';
  const name = 'Muza Admin';

  // Hash password
  const hashedPassword = await bcryptjs.hash(password, 10);

  console.log(`Creating admin account...`);
  console.log(`Email: ${email}`);
  console.log(`Name: ${name}`);

  // Connect to local database
  const dbPath = path.join(__dirname, '..', 'dev.db');
  const db = new Database(dbPath);

  try {
    // Check if admin already exists
    const existing = db.prepare('SELECT id FROM admin_users WHERE email = ?').get(email);
    if (existing) {
      console.log(`Admin user with email ${email} already exists (ID: ${existing.id})`);
      return;
    }

    // Insert admin user
    const id = require('crypto').randomBytes(12).toString('hex');
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO admin_users (id, name, email, password, role, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, name, email, hashedPassword, 'admin', 'active', now, now);

    console.log(`✅ Admin user created successfully!`);
    console.log(`ID: ${id}`);
    console.log(`\nLogin credentials:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  } finally {
    db.close();
  }
}

createAdmin();
