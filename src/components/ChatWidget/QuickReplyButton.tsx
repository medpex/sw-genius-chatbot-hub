
import React from 'react';
import { cn } from '@/lib/utils';

interface QuickReplyButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
}

const QuickReplyButton: React.FC<QuickReplyButtonProps> = ({ 
  text, 
  onClick,
  className
}) => {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-2 bg-gray-100 hover:bg-gray-200 text-swg-darkgray rounded-full text-sm transition-colors",
        className
      )}
    >
      {text}
    </button>
  );
};

export default QuickReplyButton;
