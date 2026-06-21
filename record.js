export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, birthday, q1, q2, q3 } = req.body;

    // ============================================================
    // 🎯 这里就是所有数据汇总的地方！
    // ============================================================

    console.log('========================================');
    console.log('🐷 新猪格鉴定记录');
    console.log('========================================');
    console.log(`📛 姓名：${name}`);
    console.log(`📅 生日：${birthday}`);
    console.log(`❓ Q1（买车）：${q1}`);
    console.log(`❓ Q2（最怕）：${q2}`);
    console.log(`❓ Q3（下辈子）：${q3}`);
    console.log('========================================');

    // ============================================================
    // 📱 发送到 Telegram
    // ============================================================

    await sendTelegram(`
🐷 新猪格鉴定！

📛 姓名：${name}
📅 生日：${birthday}
❓ Q1（买车）：${q1}
❓ Q2（最怕）：${q2}
❓ Q3（下辈子）：${q3}
    `);

    return res.status(200).json({
        success: true,
        message: '数据已记录'
    });
}

// ============================================================
// Telegram 通知函数
// ============================================================

async function sendTelegram(message) {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        console.log('⚠️ 未配置 Telegram');
        return;
    }

    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        console.log('✅ Telegram通知已发送');
    } catch (err) {
        console.error('Telegram发送失败:', err);
    }
}