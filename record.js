// 移到文件最顶部
const nodemailer = require('nodemailer');

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

    // 校验body存在
    if (!req.body) {
        return res.status(400).json({ error: '请求体不能为空，请携带json参数' });
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

    // ========== 替换为你自己的信息 ==========
    const QQ_EMAIL = '1308728746@qq.com';
    const QQ_AUTH_CODE = 'ffcnbqizoyzebage';

    const transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',
        port: 465,
        secure: true,
        auth: {
            user: QQ_EMAIL,
            pass: QQ_AUTH_CODE
        }
    });

    // 验证SMTP连接是否正常（新增校验，定位连接失败）
    try {
        await transporter.verify();
        console.log('✅ SMTP服务器连接正常');
    } catch (verifyErr) {
        console.error('❌ SMTP连接失败，检查邮箱/授权码', verifyErr);
        return res.status(500).json({ success: false, msg: '邮件服务连接失败' });
    }

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="font-family: Georgia, serif; background: #1a0f0a; padding: 30px; color: #e8d5b8;">
            <div style="max-width: 500px; margin: 0 auto; background: rgba(255,255,255,0.05); border-radius: 30px; padding: 30px; border: 1px solid rgba(200,150,100,0.1);">
                <h1 style="text-align: center; font-size: 28px; color: #c49a6c;">🐷 新猪格鉴定结果</h1>
                <hr style="border: none; border-top: 1px solid rgba(200,150,100,0.1); margin: 20px 0;">
                <p><strong style="color: #c49a6c;">📛 姓名：</strong>${name || '空'}</p>
                <p><strong style="color: #c49a6c;">📅 生日：</strong>${birthday || '空'}</p>
                <p><strong style="color: #c49a6c;">❓ Q1（买车）：</strong>${q1 || '空'}</p>
                <p><strong style="color: #c49a6c;">❓ Q2（最怕）：</strong>${q2 || '空'}</p>
                <p><strong style="color: #c49a6c;">❓ Q3（下辈子）：</strong>${q3 || '空'}</p>
                <hr style="border: none; border-top: 1px solid rgba(200,150,100,0.05); margin: 20px 0;">
                <p style="color: rgba(200,150,100,0.3); font-size: 12px; text-align: center;">
                    📨 发送时间：${new Date().toLocaleString('zh-CN')}
                </p>
            </div>
        </body>
        </html>
    `;

    try {
        const info = await transporter.sendMail({
            from: `"猪格鉴定所" <${QQ_EMAIL}>`,
            to: QQ_EMAIL, // 测试建议换成其他邮箱
            subject: `🐷 新猪格鉴定 - ${name}`,
            html: htmlContent,
            text: `姓名：${name}\n生日：${birthday}\nQ1：${q1}\nQ2：${q2}\nQ3：${q3}`
        });

        console.log('✅ 邮件发送成功, 消息ID:', info.messageId);
        return res.status(200).json({
            success: true,
            message: '数据已记录，邮件已发出'
        });
    } catch (err) {
        console.error('❌ 邮件发送失败完整错误:', err);
        return res.status(500).json({
            success: false,
            message: '邮件发送失败',
            error: err.message
        });
    }
}
