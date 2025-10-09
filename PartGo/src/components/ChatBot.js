import React, { useState, useRef, useEffect } from 'react';

const cannedResponses = [
    { key: /cv|resume|hồ\s*sơ|tạo\s*cv/i, reply: 'Bạn có thể vào Hồ sơ > tab Tạo CV để tạo và xuất CV. Mình có thể gợi ý mục tiêu, kinh nghiệm nếu bạn cung cấp thông tin.' },
    { key: /việc\s*làm|job|tìm\s*việc/i, reply: 'Bạn có thể dùng trang Tìm việc và bộ lọc theo khoảng cách, lịch học, mức lương, kỹ năng để tìm việc phù hợp tại Hòa Lạc.' },
    { key: /khoảng\s*cách|distance|map|bản\s*đồ/i, reply: 'Bật định vị trình duyệt để tính khoảng cách thực tế. Bạn có thể mở Google Maps chỉ đường từ nút “Xem bản đồ” trong thẻ việc làm.' },
    { key: /đăng\s*nhập|login/i, reply: 'Hiện tính năng Tạo CV không yêu cầu đăng nhập. Nếu cần, chúng tôi sẽ bật đăng nhập để đồng bộ dữ liệu.' },
];

const defaultReply = 'Mình là trợ lý Part GO. Bạn có thể hỏi: "Gợi ý mục tiêu CV cho vị trí bán hàng", "Viết 3 bullet kinh nghiệm phục vụ", "Gợi ý kỹ năng cho lập trình viên", hoặc "Tìm việc gần tôi".';

// Simple rule-based intent handlers (no external API required)
function generateObjective(role = 'vị trí bạn muốn', company = 'công ty mục tiêu') {
    return `Mục tiêu: Ứng tuyển ${role} tại ${company}, tận dụng thế mạnh về kỹ năng mềm và kỹ thuật, học hỏi nhanh, đóng góp kết quả đo được (KPIs) trong 3-6 tháng.`;
}

function generateExperienceBullets(role = 'vị trí', achievements = []) {
    const base = [
        `Phục vụ trung bình 60-80 khách/ca, duy trì mức hài lòng >95%`,
        `Tối ưu quy trình/đề xuất cải tiến giúp giảm thời gian chờ 20%`,
        `Hỗ trợ đồng đội, đảm bảo ca làm đúng chuẩn an toàn/chất lượng`,
    ];
    const lines = achievements.length ? achievements : base;
    return `Kinh nghiệm (${role}):\n- ${lines.join('\n- ')}`;
}

function suggestSkills(role = '') {
    const map = {
        'bán hàng': ['Giao tiếp', 'Thuyết phục', 'Xử lý phản đối', 'POS', 'Quản lý trưng bày'],
        'phục vụ': ['Dịch vụ khách hàng', 'Quản lý thời gian', 'Vệ sinh an toàn', 'Giao tiếp', 'Xử lý khiếu nại'],
        'lập trình': ['JavaScript', 'React', 'Node.js', 'Git', 'REST API', 'Problem-solving'],
        'marketing': ['Content', 'Social Media', 'Canva', 'Phân tích số liệu', 'SEO cơ bản'],
    };
    const key = Object.keys(map).find(k => role.toLowerCase().includes(k)) || '';
    const list = key ? map[key] : ['Giao tiếp', 'Làm việc nhóm', 'Tư duy phản biện', 'Tin học văn phòng'];
    return `Kỹ năng nên có${role ? ` cho ${role}` : ''}: ${list.join(', ')}.`;
}

function generateCoverLetter(role = 'vị trí ứng tuyển', company = 'công ty') {
    return `Kính gửi ${company},\n\nTôi quan tâm đến vị trí ${role}. Với kinh nghiệm liên quan và tinh thần học hỏi, tôi tin có thể đóng góp ngay từ tháng đầu. Tôi sẵn sàng linh hoạt thời gian, cam kết kết quả cụ thể.\n\nTrân trọng,\n[Họ tên]`;
}

function intentEngine(text) {
    const s = text.toLowerCase();
    // Objective
    if (/mục\s*tiêu|objective/.test(s)) {
        const role = (s.match(/cho\s*(vị trí|role)\s*([^,\n]+)/)?.[2] || s.match(/(bán hàng|phục vụ|lập trình|marketing)/)?.[1] || 'vị trí mong muốn');
        const company = (s.match(/tại\s*([^,\n]+)/)?.[1] || 'công ty mục tiêu');
        return generateObjective(role, company);
    }
    // Experience bullets
    if (/bullet|kinh\s*nghiệm|mô\s*tả\s*công\s*việc/.test(s)) {
        const role = (s.match(/(bán hàng|phục vụ|lập trình|marketing)/)?.[1] || 'vị trí');
        return generateExperienceBullets(role);
    }
    // Skills
    if (/kỹ\s*năng|skills?/.test(s)) {
        const role = (s.match(/(bán hàng|phục vụ|lập trình|marketing)/)?.[1] || '');
        return suggestSkills(role);
    }
    // Cover letter
    if (/thư\s*ứng\s*tuyển|cover\s*letter/.test(s)) {
        const role = (s.match(/(bán hàng|phục vụ|lập trình|marketing)/)?.[1] || 'vị trí ứng tuyển');
        const company = (s.match(/tại\s*([^,\n]+)/)?.[1] || 'công ty');
        return generateCoverLetter(role, company);
    }
    // Jobs guidance
    if (/tìm\s*việc|jobs?|gần\s*tôi|near\s*me/.test(s)) {
        return 'Bạn vào trang Tìm việc (Jobs), dùng bộ lọc khoảng cách, lịch làm, mức lương và kỹ năng. Nhấp "Xem bản đồ" để chỉ đường từ vị trí hiện tại.';
    }
    return '';
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Xin chào! Mình có thể giúp gì cho bạn hôm nay?' }
    ]);
    const [input, setInput] = useState('');
    const listRef = useRef(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const getReply = (text) => {
        const intent = intentEngine(text);
        if (intent) return intent;
        for (const c of cannedResponses) {
            if (c.key.test(text)) return c.reply;
        }
        return defaultReply;
    };

    const sendMessage = () => {
        const trimmed = input.trim();
        if (!trimmed) return;
        const userMsg = { role: 'user', text: trimmed };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        // Try AI API; fallback to canned
        const callApi = (url) => fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [...messages, userMsg] })
        });

        callApi('/api/ai/chat')
            .then(r => r.ok ? r.json() : Promise.reject(new Error('API 404'))) // try proxy first
            .then(data => {
                const botMsg = { role: 'bot', text: data.content || defaultReply };
                setMessages((prev) => [...prev, botMsg]);
            })
            .catch(() => {
                // Fallback to direct server port in dev
                callApi('http://localhost:5001/api/ai/chat')
                    .then(r => r.ok ? r.json() : Promise.reject(new Error('Direct API error')))
                    .then(data => {
                        const botMsg = { role: 'bot', text: data.content || defaultReply };
                        setMessages((prev) => [...prev, botMsg]);
                    })
                    .catch(() => {
                        // Final fallback: call Gemini directly from browser (no proxy)
                        const key = (process.env.REACT_APP_GOOGLE_API_KEY || window.GOOGLE_API_KEY || '').trim();
                        if (!key) {
                            const botMsg = { role: 'bot', text: getReply(trimmed) };
                            setMessages((prev) => [...prev, botMsg]);
                            return;
                        }
                        fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                contents: [...messages, userMsg].map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }))
                            })
                        })
                            .then(r => r.ok ? r.json() : Promise.reject(new Error('Gemini direct error')))
                            .then(data => {
                                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || defaultReply;
                                const botMsg = { role: 'bot', text };
                                setMessages((prev) => [...prev, botMsg]);
                            })
                            .catch(() => {
                                const botMsg = { role: 'bot', text: getReply(trimmed) };
                                setMessages((prev) => [...prev, botMsg]);
                            });
                    });
            });
    };

    const quickPrompts = [
        'Gợi ý mục tiêu CV cho vị trí bán hàng tại Siêu thị Hòa Lạc',
        'Viết 3 bullet kinh nghiệm phục vụ',
        'Gợi ý kỹ năng cho lập trình',
        'Mẫu thư ứng tuyển cho vị trí marketing tại Nomad',
        'Cách tìm việc gần tôi'
    ];

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    right: '20px',
                    bottom: '20px',
                    zIndex: 1050,
                    backgroundColor: '#ff6b35',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '56px',
                    height: '56px',
                    boxShadow: '0 8px 24px rgba(255, 107, 53, 0.35)',
                    cursor: 'pointer',
                    fontSize: '22px'
                }}
                aria-label="Mở chatbot"
            >
                💬
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        right: '20px',
                        bottom: '90px',
                        width: '340px',
                        maxHeight: '60vh',
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        zIndex: 1050
                    }}
                >
                    <div style={{ backgroundColor: '#ff6b35', color: 'white', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong>Part GO Assistant</strong>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', color: 'white', border: 'none', fontSize: '20px' }}>×</button>
                    </div>

                    <div ref={listRef} style={{ padding: '12px', overflowY: 'auto', flex: 1 }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{ marginBottom: '10px', display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                <div
                                    style={{
                                        backgroundColor: m.role === 'user' ? '#f1f3f5' : '#fff8f5',
                                        border: m.role === 'user' ? '1px solid #e9ecef' : '1px solid #ffe3d6',
                                        color: '#2c3e50',
                                        padding: '8px 10px',
                                        borderRadius: '10px',
                                        maxWidth: '75%'
                                    }}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {/* Quick replies */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                            {quickPrompts.map((q, idx) => (
                                <button key={idx} className="btn btn-sm btn-outline-secondary" onClick={() => { setInput(q); setTimeout(() => sendMessage(), 0); }}>
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ padding: '10px', borderTop: '1px solid #f1f3f4', display: 'flex', gap: '8px' }}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                            placeholder="Nhập câu hỏi..."
                            className="form-control"
                        />
                        <button className="btn" style={{ backgroundColor: '#ff6b35', color: 'white' }} onClick={sendMessage}>Gửi</button>
                    </div>
                </div>
            )}
        </>
    );
}


