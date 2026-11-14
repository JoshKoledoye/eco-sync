import { useEffect, useRef, useState } from 'react';

export default function EcoBotChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi Ogunmepon! I am EcoBot, your AI sustainability assistant. Ask me anything about waste sorting rules, Hub #04 rates, or your EcoPoints!' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  function handleSend(e) {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let botReply = "That's a great question regarding recycling! To maximize your material yield, ensure items are clean and dry before scheduling a pickup.";
      
      const lower = userText.toLowerCase();
      if (lower.includes('rate') || lower.includes('price') || lower.includes('pay')) {
        botReply = "Current Hub #04 rates: PET bottles pay ₦150/kg, Aluminium cans pay ₦450/kg, and Cartons pay ₦90/kg. Payouts credit instantly to your EcoWallet upon verification.";
      } else if (lower.includes('point') || lower.includes('eco')) {
        botReply = "You have 1,240 EcoPoints available in Tier 2. You can redeem them for utility discounts or convert them to NGN once you hit 1,500 points.";
      } else if (lower.includes('plastic') || lower.includes('bottle')) {
        botReply = "For PET bottles: rinse thoroughly, crush flat to save space, and keep caps separate for high-grade polymer recovery!";
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
      setIsTyping(false);
    }, 800);
  }

  return (
    <div className="chat-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <style>{`
        .chat-backdrop { 
          position: fixed; 
          inset: 0; 
          background: rgba(15, 23, 42, 0.55); 
          display: flex; 
          justify-content: flex-end; 
          z-index: 9999; 
          backdrop-filter: blur(3px); 
          animation: fadeIn 200ms ease; 
        }
        
        .chat-drawer { 
          width: 100%; 
          max-width: 420px; 
          background: #ffffff; 
          height: 100%; 
          display: flex; 
          flex-direction: column; 
          box-shadow: -10px 0 30px rgba(0,0,0,0.15); 
          animation: slideLeft 250ms cubic-bezier(.2,.75,.25,1); 
        }

        .chat-header { 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          padding: 18px 20px; 
          border-bottom: 1px solid #e2e8f0; 
          background: #f8fafc; 
        }

        .chat-title-group { 
          display: flex; 
          align-items: center; 
          gap: 12px; 
        }

        .chat-avatar-icon { 
          font-size: 24px; 
          width: 40px; 
          height: 40px; 
          border-radius: 10px; 
          background: #e0f2fe; 
          display: grid; 
          place-items: center; 
        }

        .chat-title-group h3 { 
          margin: 0; 
          font-size: 16px; 
          font-weight: 700; 
          color: #0f172a; 
        }

        .chat-status { 
          font-size: 11px; 
          color: #0284c7; 
          font-weight: 600; 
        }

        .close-button { 
          background: #f1f5f9; 
          border: none; 
          width: 34px; 
          height: 34px; 
          border-radius: 50%; 
          font-size: 18px; 
          cursor: pointer; 
          display: grid; 
          place-items: center; 
          color: #334155; 
        }

        .chat-messages { 
          flex: 1; 
          overflow-y: auto; 
          padding: 20px; 
          display: flex; 
          flex-direction: column; 
          gap: 12px; 
          background: #f8fafc; 
        }

        .chat-bubble { 
          max-width: 85%; 
          padding: 12px 16px; 
          border-radius: 14px; 
          font-size: 13.5px; 
          line-height: 1.5; 
        }

        .chat-bubble.bot { 
          background: #ffffff; 
          color: #0f172a; 
          border: 1px solid #e2e8f0; 
          align-self: flex-start; 
          border-bottom-left-radius: 4px; 
        }

        .chat-bubble.user { 
          background: #0284c7; 
          color: #ffffff; 
          align-self: flex-end; 
          border-bottom-right-radius: 4px; 
        }

        .typing-indicator span { 
          display: inline-block; 
          width: 6px; 
          height: 6px; 
          border-radius: 50%; 
          background: #94a3b8; 
          animation: bounce 1.4s infinite ease-in-out both; 
          margin: 0 2px; 
        }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce { 
          0%, 80%, 100% { transform: scale(0); } 
          40% { transform: scale(1.0); } 
        }

        .chat-input-bar { 
          padding: 16px 20px; 
          background: #ffffff; 
          border-top: 1px solid #e2e8f0; 
          display: flex; 
          gap: 10px; 
        }

        .chat-input-bar input { 
          flex: 1; 
          padding: 11px 14px; 
          border-radius: 8px; 
          border: 1px solid #e2e8f0; 
          font-size: 14px; 
          outline: none; 
          background: #f8fafc; 
          color: #0f172a; 
        }

        .chat-input-bar input:focus { 
          border-color: #0284c7; 
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1); 
        }

        .chat-send-btn {
          background: #0f172a;
          color: #ffffff;
          border: none;
          padding: 0 18px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13.5px;
          cursor: pointer;
        }

        @keyframes slideLeft { 
          from { transform: translateX(100%); } 
          to { transform: translateX(0); } 
        }
        @keyframes fadeIn { 
          from { opacity: 0; } 
          to { opacity: 1; } 
        }

        /* Mobile Viewport Optimizations */
        @media (max-width: 768px) {
          .chat-backdrop {
            align-items: flex-end; /* Slide up from bottom on mobile */
          }
          .chat-drawer {
            max-width: 100%;
            height: 88vh; /* Leave room at top to tap backdrop to close */
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            animation: slideUp 250ms cubic-bezier(.2,.75,.25,1);
          }
          .chat-input-bar {
            padding-bottom: calc(16px + env(safe-area-inset-bottom)); /* Account for mobile home indicators */
          }
        }

        @keyframes slideUp { 
          from { transform: translateY(100%); } 
          to { transform: translateY(0); } 
        }
      `}</style>

      <div className="chat-drawer">
        <div className="chat-header">
          <div className="chat-title-group">
            <span className="chat-avatar-icon">🤖</span>
            <div>
              <h3>EcoBot Assistant</h3>
              <span className="chat-status">● Gemini AI Online</span>
            </div>
          </div>
          <button type="button" className="close-button" onClick={onClose} aria-label="Close chat">×</button>
        </div>

        <div className="chat-messages" ref={chatScrollRef}>
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-bubble ${m.sender}`}>
              <div className="bubble-text">{m.text}</div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-bubble bot typing-indicator">
              <span /> <span /> <span />
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="chat-input-bar">
          <input
            type="text"
            placeholder="Ask about sorting rules or rates..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button type="submit" className="chat-send-btn">Send</button>
        </form>
      </div>
    </div>
  );
}
