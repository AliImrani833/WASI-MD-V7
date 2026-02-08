/**
 * WASI-MD Menu Plugin
 * Display bot commands and features
 * 
 * this shows all available commands to users
 * designed the menu layout myself - wasi
 */

module.exports = {
    name: 'menu',
    commands: ['menu', 'help', 'commands'], // trigger words
    category: 'general',
    description: 'Display bot menu',
    
    async execute(sock, msg, args) {
        const prefix = global.config.settings.prefix;
        
        // menu text with all commands - wasi
        const menuText = `
╭━━━『 WASI-MD V7 』━━━╮
│
│ ◈ Bot: ${global.config.botInfo.name}
│ ◈ Version: ${global.config.botInfo.version}
│ ◈ Owner: ${global.config.owner.name}
│ ◈ Prefix: ${prefix}
│
╰━━━━━━━━━━━━━━━━━━╯

╭━━━『 COMMANDS 』━━━╮
│
│ ${prefix}menu - Show this menu
│ ${prefix}ping - Check bot speed
│ ${prefix}info - Bot information
│ ${prefix}owner - Owner contact
│
╰━━━━━━━━━━━━━━━━━━╯

╭━━━『 MEDIA 』━━━╮
│
│ ${prefix}sticker - Create sticker
│ ${prefix}toimg - Sticker to image
│ ${prefix}tovideo - Sticker to video
│
╰━━━━━━━━━━━━━━━━━━╯

╭━━━『 DOWNLOAD 』━━━╮
│
│ ${prefix}ytmp3 - Download audio
│ ${prefix}ytmp4 - Download video
│ ${prefix}tiktok - TikTok downloader
│ ${prefix}instagram - IG downloader
│
╰━━━━━━━━━━━━━━━━━━╯

© ITXXWASI - WASI-MD V7
        `.trim();
        
        // send the menu
        await sock.sendMessage(msg.from, {
            text: menuText
        }, {
            quoted: msg.raw // quote the original message
        });
    }
};
