const migration = require('./initial-table-migrations-001');
async function runMigrations(direction) {
  try {
    if (direction === 'down') {
      await migration.down();
      console.log('Migration down completed successfully');
    } else {
      await migration.up();
      console.log('Migration up completed successfully');
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

const direction = process.argv[2];
runMigrations(direction);