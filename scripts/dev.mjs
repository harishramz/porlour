import { spawn } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const npmCommand = 'npm';
const children = new Set();
let shuttingDown = false;

const start = (name, args, cwd) => {
  const child = spawn(npmCommand, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
    windowsHide: false
  });

  children.add(child);

  child.on('error', (error) => {
    console.error(`[${name}] failed to start: ${error.message}`);
    shutdown(1);
  });

  child.on('exit', (code, signal) => {
    children.delete(child);
    if (!shuttingDown) {
      console.error(`[${name}] stopped${signal ? ` (${signal})` : ` with code ${code}`}.`);
      shutdown(code ?? 1);
    }
  });
};

const shutdown = (exitCode = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) child.kill('SIGTERM');
  setTimeout(() => process.exit(exitCode), 250);
};

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const serverRoot = fileURLToPath(new URL('../server/', import.meta.url));
const frontendUrl = 'http://localhost:3000';
const apiUrl = 'http://localhost:4000';

console.log('Starting Aura Luxe development services...');
console.log(`Frontend: ${frontendUrl}`);
console.log(`Backend:  ${apiUrl}`);
console.log(`Health:   ${apiUrl}/api/health`);
console.log('Database: Supabase is loaded from server/.env by the backend.');
start('api', ['run', 'dev'], serverRoot);
start('frontend', ['run', 'frontend:dev'], projectRoot);
