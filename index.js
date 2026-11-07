// AF MIR MD Reloaded 5.0
// Job ID: teoDcjc7sBw0
// Owner Name: AF mir
// Owner Number: 03701849710

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys')
const pino = require('pino')
const readline = require('readline')

// ===== AAPKA NAAM AUR NUMBER YAHAN ADD HAI =====
const OWNER_NUMBER = "923701849710" // 03701849710
const BOT_NAME = "AF MIR-MD"
const OWNER_NAME = "AF mir"
const PREFIX = "."

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session')
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ["AF MIR-MD", "Chrome", "1.0"]
    })

    // Pairing Code - Number se connect hoga
    if (!sock.authState.creds.registered) {
        console.log("Bot ko connect kar rahe hain...")
        await new Promise(r => setTimeout(r, 3000))
        let code = await sock.requestPairingCode(OWNER_NUMBER)
        console.log(`\n=================================`)
        console.log(`AAPKA PAIR CODE: ${code}`)
        console.log(`WhatsApp > Linked Devices > Link with phone number`)
        console.log(`=================================\n`)
    }

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('Connection band, dobara connect ho raha hai...')
            if (shouldReconnect) startBot()
        } else if (connection === 'open') {
            console.log(`✅ ${BOT_NAME} Online Ho Gaya! Owner: ${OWNER_NAME}`)
        }
    })

    // ===== COMMANDS =====
    sock.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const m = messages[0]
            if (!m.message || m.key.fromMe) return
            const from = m.key.remoteJid
            const body = m.message.conversation || m.message.extendedTextMessage?.text || ""
            if (!body.startsWith(PREFIX)) return

            const cmd = body.slice(1).trim().split(" ")[0].toLowerCase()
            const reply = async (text) => {
                await sock.sendMessage(from, { text: text }, { quoted: m })
            }

            if (cmd === 'ping' || cmd === 'alive') {
                await reply(`✅ *${BOT_NAME} ONLINE HAI!*\n\nSpeed: Fast\nOwner: ${OWNER_NAME}`)
            }

            if (cmd === 'menu' || cmd === 'help') {
                await sock.sendMessage(from, {
                    text: `*╭─── ${BOT_NAME} ───╮*\n\n*• .ping* - Bot check\n*• .owner* - Malik ka number\n*• .contact* - Contact\n*• .menu* - Ye list\n\n*╰─── ${OWNER_NAME} ───╯*`,
                    footer: 'AF MIR-MD Contact',
                    templateButtons: [{
                        index: 1,
                        urlButton: {
                            displayText: `📲 WhatsApp: 03701849710`,
                            url: `https://wa.me/${OWNER_NUMBER}`
                        }
                    }]
                }, { quoted: m })
            }

            if (cmd === 'owner' || cmd === 'contact' || cmd === 'malik') {
                await sock.sendMessage(from, {
                    text: `*👑 BOT OWNER*\n\n*Naam:* ${OWNER_NAME}\n*Number:* 03701849710\n\nKoi bhi kaam ho to neeche diye gaye button se rabta karo.`,
                    footer: 'AF MIR-MD Contact',
                    templateButtons: [{
                        index: 1,
                        urlButton: {
                            displayText: `📲 WhatsApp: 03701849710`,
                            url: `https://wa.me/${OWNER_NUMBER}`
                        }
                    }]
                }, { quoted: m })
            }

            if (cmd === 'hi' || cmd === 'hello') {
                await reply(`Hello! Main ${BOT_NAME} hun. Help ke liye *.menu* likho.`)
            }

        } catch (e) {
            console.log("Error:", e)
        }
    })
}

startBot()
