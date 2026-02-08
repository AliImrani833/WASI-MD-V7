/**
 * WASI-MD V7 Starter
 * Entry point that launches the real bot from the loaded core
 * © ITXXWASI - All Rights Reserved
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const CORE_DIR = path.join(__dirname, 'core');
const ENTRY_FILE = 'index.js'; // Change this to your bot's actual entry file

async function start() {
    console.log('\n═══════════════════════════════════════════════');
    console.log('   ⚡ WASI-MD V7 - STARTING BOT');
    console.log('═══════════════════════════════════════════════\n');

    const entryPath = path.join(CORE_DIR, ENTRY_FILE);

    // Check if core exists
    if (!fs.existsSync(CORE_DIR)) {
        console.error('❌ ERROR: Core directory not found!');
        console.error('   The loader may have failed. Check GITLAB_TOKEN.\n');
        process.exit(1);
    }

    if (!fs.existsSync(entryPath)) {
        console.error(`❌ ERROR: Entry file "${ENTRY_FILE}" not found in core!`);
        console.error('   Check if the GitLab repo has the correct structure.\n');
        process.exit(1);
    }

    console.log(`🤖 Launching WASI-MD V7...`);
    console.log(`   Entry: ${ENTRY_FILE}\n`);

    // Spawn the bot process
    const bot = spawn('node', [entryPath], {
        cwd: CORE_DIR,
        stdio: 'inherit',
        env: process.env
    });

    bot.on('error', (err) => {
        console.error('❌ Failed to start bot:', err.message);
        process.exit(1);
    });

    bot.on('exit', (code) => {
        console.log(`\n🛑 Bot exited with code: ${code}`);
        process.exit(code || 0);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
        console.log('\n⚠️  Received SIGTERM, shutting down gracefully...');
        bot.kill('SIGTERM');
    });

    process.on('SIGINT', () => {
        console.log('\n⚠️  Received SIGINT, shutting down gracefully...');
        bot.kill('SIGINT');
    });
}

start();
