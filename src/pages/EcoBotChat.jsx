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
      <div className="chat-drawer">
        <div className="chat-header">
          <div className="chat-title-group">
            <span className="chat-avatar-icon">🤖</span>
            <div>
              <h3>EcoBot Assistant</h3>
              <span className="chat-status">● Gemini AI Online</span>
            </div>
          </div>
          <button type="button" className="close-button" onClick={onClose}>×</button>
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
          <button type="submit" className="cta-button dark">Send</button>
        </form>
      </div>
    </div>
  );
}
