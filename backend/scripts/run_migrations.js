const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

function getEnv(name, fallback) {
  const value = process.env[name];
  return value !== undefined && value !== '' ? value : fallback;
}

const DB_USER = getEnv('PGUSER', 'postgres');
const DB_PASSWORD = getEnv('PGPASSWORD', getEnv('DB_PASSWORD', ''));
const DB_HOST = getEnv('PGHOST', 'localhost');
const DB_PORT = getEnv('PGPORT', '5432');
const TARGET_DB = getEnv('PGDATABASE', getEnv('DATABASE', getEnv('DB_NAME', 'felizardos_admin_db')));

function connectionString(dbName) {
  return `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${dbName}`;
}

async function ensureDatabase() {
  const client = new Client({ connectionString: connectionString('postgres') });
  await client.connect();
  const res = await client.query(`SELECT 1 FROM pg_database WHERE datname='${TARGET_DB}'`);
  if (res.rowCount === 0) {
    console.log(`Creating database ${TARGET_DB}...`);
    await client.query(`CREATE DATABASE ${TARGET_DB};`);
  } else {
    console.log(`Database ${TARGET_DB} already exists`);
  }
  await client.end();
}

async function runFile(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  const client = new Client({ connectionString: connectionString(TARGET_DB) });
  await client.connect();
  console.log(`Applying ${path.basename(filePath)}...`);
  try {
    await client.query(sql);
    console.log(`Applied ${path.basename(filePath)}`);
  } catch (err) {
    console.error(`Error applying ${path.basename(filePath)}:`, err.message || err);
    await client.end();
    throw err;
  }
  await client.end();
}

async function listTables() {
  const client = new Client({ connectionString: connectionString(TARGET_DB) });
  await client.connect();
  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;");
  console.log('Tables in public schema:');
  res.rows.forEach(r => console.log('-', r.table_name));
  await client.end();
}

async function main() {
  try {
    await ensureDatabase();

    const migrations = [
      path.join(__dirname, '..', 'db', 'migrations', '20260530_create_core_facility_tables.sql'),
      path.join(__dirname, '..', 'db', 'migrations', '20260531_fix_users_updated_at.sql'),
      path.join(__dirname, '..', 'db', 'migrations', '20260531_create_pool_court_booking_tables.sql'),
      path.join(__dirname, '..', 'db', 'migrations', '20260531_seed_demo_facility_data.sql'),
      path.join(__dirname, '..', 'db', 'migrations', '20260529_add_booking_fields_pavilion_bookings.sql'),
      path.join(__dirname, '..', 'db', 'migrations', '20260529_add_client_fields_pavilion_bookings.sql')
    ];

    for (const m of migrations) {
      await runFile(m);
    }

    await listTables();
    console.log('Migrations complete.');
  } catch (err) {
    console.error('Migration runner failed:', err.message || err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
