/**
 * WASI-MD Message Handler
 * Advanced Message Processing System
 */

class WasiMessageHandler {
    constructor(bot) {
        this.bot = bot;
        this.processors = [];
    }
    
    addProcessor(processor) {
        this.processors.push(processor);
    }
    
    async process(sock, message) {
        try {
            // Extract message info
            const msgInfo = this.extractMessageInfo(message);
            
            // Run through processors
            for (const processor of this.processors) {
                const result = await processor(sock, msgInfo);
                if (result === false) break; // Stop processing
            }
        } catch (error) {
            console.error('Message processing error:', error);
        }
    }
    
    extractMessageInfo(message) {
        const msg = message.message;
        const type = Object.keys(msg)[0];
        
        return {
            key: message.key,
            from: message.key.remoteJid,
            sender: message.key.participant || message.key.remoteJid,
            type: type,
            text: this.extractText(msg),
            isGroup: message.key.remoteJid.endsWith('@g.us'),
            timestamp: message.messageTimestamp,
            raw: message
        };
    }
    
    extractText(message) {
        return message.conversation ||
               message.extendedTextMessage?.text ||
               message.imageMessage?.caption ||
               message.videoMessage?.caption ||
               '';
    }
    
    async reply(sock, msgInfo, text, options = {}) {
        return await sock.sendMessage(msgInfo.from, {
            text: text,
            ...options
        }, {
            quoted: msgInfo.raw
        });
    }
}

module.exports = WasiMessageHandler;
