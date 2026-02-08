/**
 * WASI-MD Database Manager
 * Advanced Database Operations Handler
 * 
 * handles all database stuff using mongoose
 * made this modular so its easy to switch databases - wasi
 */

const mongoose = require('mongoose'); // mongodb driver

class WasiDatabase {
    constructor(config) {
        this.config = config;
        this.connection = null; // will store connection
        this.models = new Map(); // store all models here
    }
    
    async connect() {
        try {
            // connect to mongodb
            this.connection = await mongoose.connect(this.config.url, this.config.options);
            console.log('Database connected successfully!');
            return true;
        } catch (error) {
            console.error('Database connection failed:', error.message);
            return false; // connection failed
        }
    }
    
    async disconnect() {
        if (this.connection) {
            await mongoose.disconnect();
            console.log('Database disconnected');
        }
    }
    
    registerModel(name, schema) {
        // create and register a new model
        const model = mongoose.model(name, schema);
        this.models.set(name, model);
        return model;
    }
    
    getModel(name) {
        // get a registered model
        return this.models.get(name);
    }
    
    async query(modelName, operation, params) {
        const model = this.getModel(modelName);
        if (!model) {
            throw new Error(`Model ${modelName} not found`);
        }
        
        // handle different operations - wasi
        switch (operation) {
            case 'find':
                return await model.find(params);
            case 'findOne':
                return await model.findOne(params);
            case 'create':
                return await model.create(params);
            case 'update':
                return await model.updateOne(params.filter, params.update);
            case 'delete':
                return await model.deleteOne(params);
            default:
                throw new Error(`Unknown operation: ${operation}`);
        }
    }
}

module.exports = WasiDatabase;
