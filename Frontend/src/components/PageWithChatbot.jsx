import { useState } from 'react';
import ChatbotPopup, { ChatbotToggleButton } from './ChatbotPopup';

export default function PageWithChatbot({ children }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      {children}
      <ChatbotToggleButton onClick={() => setChatOpen((open) => !open)} />
      <ChatbotPopup open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
