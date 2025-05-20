
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser, timestamp, isTyping = false }) => {
  return (
    <div className={cn(
      "flex w-full mb-4 max-w-[85%]",
      isUser ? "ml-auto justify-end" : "mr-auto justify-start"
    )}>
      {!isUser && (
        <Avatar className="h-8 w-8 mr-2">
          <div className="bg-swg-blue text-white h-full w-full flex items-center justify-center rounded-full">
            SW
          </div>
        </Avatar>
      )}
      <div className="flex flex-col">
        <div
          className={cn(
            "rounded-lg px-4 py-2",
            isUser ? "bg-swg-blue text-white rounded-tr-none" : "bg-gray-100 text-swg-darkgray rounded-tl-none"
          )}
        >
          {isTyping ? (
            <span className="typing-dots">Schreibe</span>
          ) : (
            message
          )}
        </div>
        <span className="text-xs text-gray-500 mt-1">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 ml-2">
          <div className="bg-swg-green text-white h-full w-full flex items-center justify-center rounded-full">
            SIE
          </div>
        </Avatar>
      )}
    </div>
  );
};

export default ChatBubble;
