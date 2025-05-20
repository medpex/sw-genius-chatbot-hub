
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatHeader from './ChatHeader';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import QuickReplyButton from './QuickReplyButton';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const quickReplies = [
    { text: 'Strompreise', handler: () => handleSendMessage('Wie hoch sind die aktuellen Strompreise?') },
    { text: 'Glasfaser', handler: () => handleSendMessage('Informationen zu Glasfaser') },
    { text: 'Kontakt', handler: () => handleSendMessage('Wie kann ich Kontakt aufnehmen?') },
    { text: 'Störungsmeldung', handler: () => handleSendMessage('Ich möchte eine Störung melden') }
  ];

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      // Send welcome message when opening chat for the first time
      setTimeout(() => {
        setMessages([
          {
            id: '1',
            content: 'Willkommen beim Chatbot der Stadtwerke Geesthacht! Wie kann ich Ihnen heute helfen?',
            isUser: false,
            timestamp: new Date()
          }
        ]);
      }, 500);
    }
  };

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Simulate bot response after delay
    setTimeout(() => {
      setIsTyping(false);
      
      let botResponse = '';
      
      // Simple response logic based on keywords
      if (content.toLowerCase().includes('strom') || content.toLowerCase().includes('strompreis')) {
        botResponse = 'Unsere aktuellen Strompreise finden Sie auf unserer Webseite unter "Tarife". Aktuell bieten wir einen Grundpreis ab 9,95€ pro Monat und einen Arbeitspreis ab 28,5 Cent pro kWh.';
      } else if (content.toLowerCase().includes('glasfaser')) {
        botResponse = 'Wir bauen das Glasfasernetz in Geesthacht aus! Informieren Sie sich auf unserer Webseite über die Verfügbarkeit in Ihrem Wohngebiet und die aktuellen Angebote.';
      } else if (content.toLowerCase().includes('kontakt')) {
        botResponse = 'Sie erreichen uns telefonisch unter 04152 / 929-0, per E-Mail an info@stadtwerke-geesthacht.de oder persönlich in unserem Kundenzentrum in der Bergedorfer Str. 30-32.';
      } else if (content.toLowerCase().includes('störung')) {
        botResponse = 'Für Störungsmeldungen nutzen Sie bitte unsere 24/7-Hotline: 04152 / 929-200 oder das Kontaktformular auf unserer Webseite.';
      } else {
        botResponse = 'Vielen Dank für Ihre Anfrage. Möchten Sie mehr über unsere Strom- und Gastarife, Glasfaserangebote oder Serviceleistungen erfahren? Oder soll ich Sie mit einem Mitarbeiter verbinden?';
      }
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: botResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1500);
  };

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="flex flex-col w-96 h-[480px] bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <ChatHeader onClose={toggleChat} />
          
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            
            {isTyping && (
              <ChatBubble
                message=""
                isUser={false}
                timestamp={new Date()}
                isTyping={true}
              />
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {messages.length === 1 && messages[0].isUser === false && (
            <div className="p-4 flex flex-wrap gap-2 bg-gray-50 border-t border-gray-100">
              {quickReplies.map((reply, index) => (
                <QuickReplyButton 
                  key={index} 
                  text={reply.text} 
                  onClick={reply.handler}
                />
              ))}
            </div>
          )}
          
          <div className="p-4 border-t border-gray-200">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      ) : (
        <Button
          onClick={toggleChat}
          className="rounded-full w-16 h-16 bg-swg-blue hover:bg-swg-blue/90 shadow-lg"
        >
          <MessageCircle size={24} />
        </Button>
      )}
    </div>
  );
};

export default ChatWidget;
