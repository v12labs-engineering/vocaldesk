// Run this script to spin up a Dockerized Supabase instance for local testing
// You will need a Docker installation and .env.local file with the following variables:
// SUPABASE_PROJECT_REF: The project reference for your Supabase instance
// SUPABASE_DB_PASSWORD: The password for your Supabase instance
// You can find these values in the Supabase dashboard for your remote instance
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const { execFileSync } = require('child_process');

const projectRef = process.env.SUPABASE_PROJECT_REF;
const databasePassword = process.env.SUPABASE_DB_PASSWORD;

if (!projectRef || !databasePassword) {
  console.error('SUPABASE_PROJECT_REF and SUPABASE_DB_PASSWORD are required.');
  process.exit(1);
}

try {
	execFileSync(
		'npx',
		['supabase', 'link', '--project-ref', projectRef, '--password', databasePassword],
		{ stdio: 'inherit' },
	);
} catch (error) {
	console.error('Supabase link failed:', error.name);
	process.exit(1);
}
