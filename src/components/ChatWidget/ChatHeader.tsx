
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  onClose: () => void;
  online?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose, online = true }) => {
  return (
    <div className="bg-swg-blue p-4 rounded-t-lg flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
          <span className="text-swg-blue font-bold text-sm">SW</span>
        </div>
        <div>
          <h3 className="font-medium text-white">SWGenius</h3>
          <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full ${online ? 'bg-swg-green' : 'bg-gray-300'} mr-1`} />
            <span className="text-xs text-white/80">
              {online ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatHeader;
