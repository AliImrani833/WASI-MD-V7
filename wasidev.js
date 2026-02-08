/**
 * WASI-MD Development Core
 * Advanced Bot Development Framework
 * © ITXXWASI
 * 
 * this is my custom framework built on top of baileys
 * took me forever to get event handling right - wasi
 */

const EventEmitter = require('events');
const { Boom } = require('@hapi/boom'); // for connection errors

class WasiDev extends EventEmitter {
    constructor(options = {}) {
        super();
        // default config - can be overridden
        this.config = {
            version: '7.2.0',
            mode: options.mode || 'production',
            prefix: options.prefix || '.', // dot prefix is classic
            owner: options.owner || [],
            ...options
        };
        
        // using maps for better performance - wasi
        this.commands = new Map();
        this.plugins = new Map();
        this.handlers = new Map();
    }
    
    async initialize() {
        console.log('Initializing WasiDev Framework...');
        
        // Load core modules first
        await this.loadCoreModules();
        
        // Initialize connection to whatsapp
        await this.initializeConnection();
        
        // Load all plugins
        await this.loadPlugins();
        
        // Setup event handlers
        await this.setupHandlers();
        
        console.log('WasiDev Framework initialized!');
    }
    
    async loadCoreModules() {
        // these are the essential modules - wasi
        const modules = [
            'baileys-handler', // handles baileys connection
            'message-processor', // processes incoming messages
            'command-handler', // executes commands
            'plugin-loader', // loads plugins dynamically
            'database-manager' // manages database operations
        ];
        
        for (const module of modules) {
            try {
                const mod = require(`./lib/${module}`);
                this.handlers.set(module, mod);
            } catch (err) {
                console.error(`Failed to load ${module}:`, err.message);
                // continue anyway, some modules are optional
            }
        }
    }
    
    async initializeConnection() {
        const { default: makeWASocket } = require('@whiskeysockets/baileys');
        
        // create whatsapp socket connection - wasi
        this.sock = makeWASocket({
            auth: this.config.auth,
            printQRInTerminal: true, // show qr in terminal
            logger: this.config.logger,
            browser: ['WASI-MD', 'Chrome', '7.0.0'] // custom browser tag
        });
        
        // setup event listeners - these are important
        this.sock.ev.on('connection.update', this.handleConnection.bind(this));
        this.sock.ev.on('messages.upsert', this.handleMessages.bind(this));
        this.sock.ev.on('creds.update', this.handleCredsUpdate.bind(this));
    }
    
    async handleConnection(update) {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            // check if we should reconnect
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)
                ? lastDisconnect.error.output.statusCode !== 401
                : true;
                
            if (shouldReconnect) {
                await this.initializeConnection(); // reconnect automatically
            }
        } else if (connection === 'open') {
            console.log('Connection opened successfully!');
        }
    }
    
    async handleMessages({ messages }) {
        for (const msg of messages) {
            if (!msg.message) continue;
            
            const messageHandler = this.handlers.get('message-processor');
            if (messageHandler) {
                await messageHandler.process(this.sock, msg);
            }
        }
    }
    
    async handleCredsUpdate() {
        // Save credentials
        if (this.config.saveCreds) {
            await this.config.saveCreds();
        }
    }
    
    async loadPlugins() {
        const pluginDir = './plugins';
        const files = require('fs').readdirSync(pluginDir);
        
        for (const file of files) {
            if (!file.endsWith('.js')) continue;
            
            try {
                const plugin = require(`${pluginDir}/${file}`);
                this.plugins.set(file, plugin);
            } catch (err) {
                console.error(`Failed to load plugin ${file}:`, err.message);
            }
        }
    }
    
    async setupHandlers() {
        // Command handler
        this.on('command', async (cmd, args, msg) => {
            const handler = this.commands.get(cmd);
            if (handler) {
                await handler(this.sock, msg, args);
            }
        });
        
        // Error handler
        this.on('error', (err) => {
            console.error('WasiDev Error:', err);
        });
    }
    
    registerCommand(name, handler) {
        this.commands.set(name, handler);
    }
    
    async sendMessage(jid, content, options = {}) {
        return await this.sock.sendMessage(jid, content, options);
    }
}

module.exports = WasiDev;
