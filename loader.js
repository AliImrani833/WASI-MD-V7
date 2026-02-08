/**
 * ═══════════════════════════════════════════════════════════════════
 *  WASI-MD V7 CORE LOADER
 *  Advanced WhatsApp Bot Initialization System
 *  © ITXXWASI - All Rights Reserved
 * 
 *  yo this took me 3 days to perfect lol
 *  finally got the encryption working properly - wasi
 * ═══════════════════════════════════════════════════════════════════
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); // needed for session encryption

// Core Configuration
// changed this like 10 times until it worked right - wasi
const WASI_CONFIG = {
    REPO_URL: 'https://github.com/itxxwasi/WASI-MD-CORE.git', // main repo
    BRANCH: process.env.BRANCH || 'main',
    CORE_DIR: path.join(__dirname, 'wasi_core'),
    CACHE_DIR: path.join(__dirname, '.wasi_cache'), // for faster loads
    ENCRYPTION_KEY: process.env.WASI_KEY || 'default_wasi_key_v7',
    MAX_RETRIES: 5, // sometimes network is slow
    TIMEOUT: 180000 // 3 minutes should be enough
};

// Wasi Logger
// made this to keep logs clean and colorful - wasi
class WasiLogger {
    static info(msg) {
        console.log(`\x1b[36m[WASI-INFO]\x1b[0m ${msg}`);
    }
    
    static success(msg) {
        console.log(`\x1b[32m[WASI-SUCCESS]\x1b[0m ${msg}`);
    }
    
    static error(msg) {
        console.error(`\x1b[31m[WASI-ERROR]\x1b[0m ${msg}`);
    }
    
    static warn(msg) {
        console.log(`\x1b[33m[WASI-WARN]\x1b[0m ${msg}`); // yellow looks better
    }
}

// Wasi Encryption Handler
// spent a whole night figuring out aes-256-cbc lol - wasi
class WasiEncryption {
    constructor(key) {
        this.algorithm = 'aes-256-cbc'; // most secure one
        this.key = crypto.scryptSync(key, 'salt', 32);
        this.iv = crypto.randomBytes(16); // random iv for security
    }
    
    encrypt(text) {
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted; // returns hex string
    }
    
    decrypt(encrypted) {
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted; // back to normal text
    }
}

// Wasi Core Validator
// these checks saved me from so many bugs - wasi
class WasiValidator {
    static validateSession() {
        const sessionId = process.env.SESSION_ID;
        if (!sessionId) {
            WasiLogger.error('SESSION_ID not found in environment!');
            return false;
        }
        
        // Validate session format - must start with WASI-MD~
        if (!sessionId.startsWith('WASI-MD~')) {
            WasiLogger.warn('Invalid session format detected');
            return false; // wrong format = no go
        }
        
        return true;
    }
    
    static validateOwner() {
        const owner = process.env.OWNER_NUMBER;
        if (!owner || owner.length < 10) {
            WasiLogger.error('Invalid OWNER_NUMBER configuration');
            return false; // need proper phone number
        }
        return true;
    }
    
    static validateCore() {
        const corePath = path.join(WASI_CONFIG.CORE_DIR, 'index.js');
        if (!fs.existsSync(corePath)) {
            WasiLogger.error('Core files not found! Initialization required.');
            return false; // core missing, need to download
        }
        return true;
    }
}

// Wasi Core Downloader
// this handles all the downloading stuff - wasi
class WasiDownloader {
    static async downloadCore() {
        WasiLogger.info('Initializing WASI-MD Core download...');
        
        try {
            // Clean existing core - fresh start is better
            if (fs.existsSync(WASI_CONFIG.CORE_DIR)) {
                WasiLogger.info('Cleaning old core files...');
                fs.rmSync(WASI_CONFIG.CORE_DIR, { recursive: true, force: true });
            }
            
            // Create directories - make sure they exist
            fs.mkdirSync(WASI_CONFIG.CORE_DIR, { recursive: true });
            fs.mkdirSync(WASI_CONFIG.CACHE_DIR, { recursive: true });
            
            // Download core files from github
            WasiLogger.info('Fetching WASI-MD Core from repository...');
            execSync(`git clone --depth 1 --branch ${WASI_CONFIG.BRANCH} ${WASI_CONFIG.REPO_URL} ${WASI_CONFIG.CORE_DIR}`, {
                stdio: 'pipe',
                timeout: WASI_CONFIG.TIMEOUT
            });
            
            // Remove git directory - dont need it after clone
            const gitDir = path.join(WASI_CONFIG.CORE_DIR, '.git');
            if (fs.existsSync(gitDir)) {
                fs.rmSync(gitDir, { recursive: true, force: true });
            }
            
            WasiLogger.success('Core files downloaded successfully!');
            return true;
            
        } catch (error) {
            WasiLogger.error(`Download failed: ${error.message}`);
            return false; // something went wrong
        }
    }
    
    static async installDependencies() {
        WasiLogger.info('Installing core dependencies...');
        
        try {
            const pkgPath = path.join(WASI_CONFIG.CORE_DIR, 'package.json');
            if (!fs.existsSync(pkgPath)) {
                WasiLogger.warn('No package.json found in core');
                return true; // no deps needed i guess
            }
            
            // install all the npm packages
            execSync('npm install --production', {
                cwd: WASI_CONFIG.CORE_DIR,
                stdio: 'inherit', // show the output
                timeout: 300000 // 5 mins max
            });
            
            WasiLogger.success('Dependencies installed!');
            return true;
            
        } catch (error) {
            WasiLogger.error(`Dependency installation failed: ${error.message}`);
            return false; // npm install failed
        }
    }
}

// Wasi Core Initializer
class WasiInitializer {
    static async initialize() {
        console.log('\n');
        console.log('\x1b[36m═══════════════════════════════════════════════════════════════\x1b[0m');
        console.log('\x1b[36m   🚀 WASI-MD V7 CORE LOADER\x1b[0m');
        console.log('\x1b[36m   Advanced WhatsApp Bot System\x1b[0m');
        console.log('\x1b[36m   © ITXXWASI - Version 7.2.0\x1b[0m');
        console.log('\x1b[36m═══════════════════════════════════════════════════════════════\x1b[0m');
        console.log('');
        
        // Step 1: Validate environment
        WasiLogger.info('Step 1: Validating environment...');
        if (!WasiValidator.validateSession()) {
            process.exit(1);
        }
        if (!WasiValidator.validateOwner()) {
            process.exit(1);
        }
        WasiLogger.success('Environment validated!');
        console.log('');
        
        // Step 2: Check core files
        WasiLogger.info('Step 2: Checking core files...');
        if (!WasiValidator.validateCore()) {
            WasiLogger.warn('Core files missing, downloading...');
            
            const downloaded = await WasiDownloader.downloadCore();
            if (!downloaded) {
                WasiLogger.error('Failed to download core files!');
                process.exit(1);
            }
            
            const installed = await WasiDownloader.installDependencies();
            if (!installed) {
                WasiLogger.error('Failed to install dependencies!');
                process.exit(1);
            }
        }
        WasiLogger.success('Core files ready!');
        console.log('');
        
        // Step 3: Initialize encryption
        WasiLogger.info('Step 3: Initializing encryption...');
        const encryption = new WasiEncryption(WASI_CONFIG.ENCRYPTION_KEY);
        WasiLogger.success('Encryption initialized!');
        console.log('');
        
        // Step 4: Load core modules
        WasiLogger.info('Step 4: Loading core modules...');
        try {
            const coreIndex = path.join(WASI_CONFIG.CORE_DIR, 'index.js');
            require(coreIndex);
            WasiLogger.success('Core modules loaded!');
        } catch (error) {
            WasiLogger.error(`Failed to load core: ${error.message}`);
            process.exit(1);
        }
        
        console.log('');
        console.log('\x1b[32m═══════════════════════════════════════════════════════════════\x1b[0m');
        console.log('\x1b[32m   ✅ WASI-MD V7 INITIALIZED SUCCESSFULLY!\x1b[0m');
        console.log('\x1b[32m═══════════════════════════════════════════════════════════════\x1b[0m');
        console.log('');
    }
}

// Error Handler
process.on('unhandledRejection', (err) => {
    WasiLogger.error(`Unhandled rejection: ${err.message}`);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    WasiLogger.error(`Uncaught exception: ${err.message}`);
    process.exit(1);
});

// Run Initializer
WasiInitializer.initialize().catch(err => {
    WasiLogger.error(`Fatal error: ${err.message}`);
    process.exit(1);
});
