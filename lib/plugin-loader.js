/**
 * WASI-MD Plugin Loader
 * Dynamic Plugin Management System
 */

const fs = require('fs');
const path = require('path');

class WasiPluginLoader {
    constructor(pluginDir) {
        this.pluginDir = pluginDir;
        this.plugins = new Map();
        this.commands = new Map();
    }
    
    async loadAll() {
        const files = fs.readdirSync(this.pluginDir);
        
        for (const file of files) {
            if (!file.endsWith('.js')) continue;
            
            try {
                await this.load(file);
            } catch (error) {
                console.error(`Failed to load plugin ${file}:`, error.message);
            }
        }
        
        console.log(`Loaded ${this.plugins.size} plugins`);
    }
    
    async load(filename) {
        const filepath = path.join(this.pluginDir, filename);
        
        // Clear cache
        delete require.cache[require.resolve(filepath)];
        
        // Load plugin
        const plugin = require(filepath);
        
        if (!plugin.name) {
            throw new Error('Plugin must have a name');
        }
        
        this.plugins.set(plugin.name, plugin);
        
        // Register commands
        if (plugin.commands) {
            for (const cmd of plugin.commands) {
                this.commands.set(cmd, plugin);
            }
        }
    }
    
    async reload(pluginName) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) {
            throw new Error(`Plugin ${pluginName} not found`);
        }
        
        // Unload
        this.unload(pluginName);
        
        // Reload
        await this.load(plugin.filename);
    }
    
    unload(pluginName) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) return;
        
        // Remove commands
        if (plugin.commands) {
            for (const cmd of plugin.commands) {
                this.commands.delete(cmd);
            }
        }
        
        this.plugins.delete(pluginName);
    }
    
    getPlugin(name) {
        return this.plugins.get(name);
    }
    
    getCommand(cmd) {
        return this.commands.get(cmd);
    }
    
    listPlugins() {
        return Array.from(this.plugins.keys());
    }
}

module.exports = WasiPluginLoader;
