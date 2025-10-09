const express = require('express');
const router = express.Router();

// Simple rule-based fallback to keep working without an API key
function ruleBasedReply(text = '') {
    const s = (text || '').toLowerCase();
    if (/mục\s*tiêu|objective/.test(s)) {
        return 'Mục tiêu: Ứng tuyển vị trí mong muốn, tận dụng thế mạnh, cam kết kết quả đo được trong 3-6 tháng.';
    }
    if (/bullet|kinh\s*nghiệm|mô\s*tả\s*công\s*việc/.test(s)) {
        return 'Kinh nghiệm:\n- Phục vụ 60-80 khách/ca, hài lòng >95%\n- Giảm thời gian chờ 20%\n- Tuân thủ an toàn & hỗ trợ đồng đội';
    }
    if (/kỹ\s*năng|skills?/.test(s)) {
        return 'Kỹ năng: Giao tiếp, Làm việc nhóm, Tư duy phản biện, Tin học văn phòng';
    }
    if (/thư\s*ứng\s*tuyển|cover\s*letter/.test(s)) {
        return 'Kính gửi công ty, tôi quan tâm đến vị trí ứng tuyển. Tôi có kinh nghiệm phù hợp và tinh thần học hỏi, sẵn sàng đóng góp ngay. Trân trọng, [Họ tên]';
    }
    if (/tìm\s*việc|jobs?|gần\s*tôi|near\s*me/.test(s)) {
        return 'Mẹo: Dùng trang Tìm việc, lọc theo khoảng cách/lịch/mức lương/kỹ năng và mở “Xem bản đồ” để chỉ đường.';
    }
    return 'Bạn có thể yêu cầu: mục tiêu CV, bullet kinh nghiệm, kỹ năng theo vị trí, thư ứng tuyển, hoặc cách tìm việc.';
}

router.post('/chat', async (req, res) => {
    try {
        const { messages = [] } = req.body || {};
        const userText = messages
            .filter(m => (m.role || '').toLowerCase() === 'user')
            .map(m => (m.text || '').toString())
            .join('\n');

        const apiKey = (process.env.GOOGLE_API_KEY || process.env.REACT_APP_GOOGLE_API_KEY || '').trim();

        if (!apiKey) {
            return res.json({ content: ruleBasedReply(userText) });
        }

        // Call Gemini 1.5 Flash
        const resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + encodeURIComponent(apiKey), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: messages.map(m => ({
                    role: (m.role === 'user' ? 'user' : 'model'),
                    parts: [{ text: m.text }]
                }))
            })
        });

        if (!resp.ok) {
            const text = await resp.text();
            console.warn('Gemini error:', resp.status, text);
            return res.json({ content: ruleBasedReply(userText) });
        }
        const data = await resp.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ruleBasedReply(userText);
        return res.json({ content });
    } catch (err) {
        console.error('AI chat error:', err);
        return res.status(200).json({ content: ruleBasedReply((req.body && req.body.messages && req.body.messages[0]?.text) || '') });
    }
});

module.exports = router;







