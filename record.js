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
    // 📧 通过 Resend 发送邮件到你的邮箱
    // 使用 Resend 默认发件人 onboarding@resend.dev
    // ============================================================

    // ⚠️ 把下面这个改成你自己的邮箱！
    const YOUR_EMAIL = '1308728746@qq.com';

    // Resend 默认发件人（不需要验证域名）
    const FROM_EMAIL = 'onboarding@resend.dev';

    // 构建邮件内容
    const subject = `🐷 新猪格鉴定 - ${name}`;
    const textContent = `
🐷 新猪格鉴定结果

📛 姓名：${name}
📅 生日：${birthday}
❓ Q1（买车）：${q1}
❓ Q2（最怕）：${q2}
❓ Q3（下辈子）：${q3}

发送时间：${new Date().toLocaleString('zh-CN')}
    `;

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="font-family: Georgia, serif; background: #1a0f0a; padding: 30px; color: #e8d5b8;">
            <div style="max-width: 500px; margin: 0 auto; background: rgba(255,255,255,0.05); border-radius: 30px; padding: 30px; border: 1px solid rgba(200,150,100,0.1);">
                <h1 style="text-align: center; font-size: 28px; color: #c49a6c;">🐷 新猪格鉴定结果</h1>
                <hr style="border: none; border-top: 1px solid rgba(200,150,100,0.1); margin: 20px 0;">
                <p><strong style="color: #c49a6c;">📛 姓名：</strong>${name}</p>
                <p><strong style="color: #c49a6c;">📅 生日：</strong>${birthday}</p>
                <p><strong style="color: #c49a6c;">❓ Q1（买车）：</strong>${q1}</p>
                <p><strong style="color: #c49a6c;">❓ Q2（最怕）：</strong>${q2}</p>
                <p><strong style="color: #c49a6c;">❓ Q3（下辈子）：</strong>${q3}</p>
                <hr style="border: none; border-top: 1px solid rgba(200,150,100,0.05); margin: 20px 0;">
                <p style="color: rgba(200,150,100,0.3); font-size: 12px; text-align: center;">
                    📨 发送时间：${new Date().toLocaleString('zh-CN')}
                </p>
            </div>
        </body>
        </html>
    `;

    try {
        const resendRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: `猪格鉴定所 <${FROM_EMAIL}>`,
                to: [YOUR_EMAIL],
                subject: subject,
                html: htmlContent,
                text: textContent
            })
        });

        const result = await resendRes.json();
        console.log('📧 邮件发送结果:', result);

        if (!resendRes.ok) {
            console.error('❌ 邮件发送失败:', result);
            // 即使邮件失败，也继续返回成功，不影响用户体验
        } else {
            console.log(`✅ 邮件已发送到 ${YOUR_EMAIL}`);
        }

    } catch (err) {
        console.error('❌ 邮件发送异常:', err);
    }

    return res.status(200).json({
        success: true,
        message: '数据已记录'
    });
}
