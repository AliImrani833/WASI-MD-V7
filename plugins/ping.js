/**
 * WASI-MD Ping Plugin
 * Check bot response time
 * 
 * simple ping command to test bot speed
 * users love this one - wasi
 */

module.exports = {
    name: 'ping',
    commands: ['ping', 'speed', 'test'], // all trigger this
    category: 'general',
    description: 'Check bot speed',
    
    async execute(sock, msg, args) {
        const start = Date.now(); // start timer
        
        // send initial message
        const sent = await sock.sendMessage(msg.from, {
            text: '⏱️ Checking speed...'
        }, {
            quoted: msg.raw
        });
        
        const end = Date.now(); // end timer
        const ping = end - start; // calculate ping
        
        // edit message with result - wasi
        await sock.sendMessage(msg.from, {
            text: `🚀 *WASI-MD Speed Test*\n\n⚡ Response Time: ${ping}ms\n✅ Status: Online\n📡 Server: Active`,
            edit: sent.key // edit the previous message
        });
    }
};
