
import React from 'react';
import { Battery, Wifi, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="relative w-full max-w-[390px] h-[844px] bg-white rounded-[48px] shadow-2xl overflow-hidden border-[8px] border-gray-800 flex flex-col">
        {/* Status Bar */}
        <div className="w-full h-12 flex items-center justify-between px-8 z-50 bg-inherit">
          <div className="text-sm font-semibold">9:41</div>
          <div className="flex items-center space-x-1">
            <Signal size={14} strokeWidth={2.5} />
            <Wifi size={14} strokeWidth={2.5} />
            <Battery size={18} strokeWidth={2} />
          </div>
        </div>
        
        {/* Screen Content Container */}
        <div className="flex-1 relative overflow-hidden bg-slate-50">
          {children}
        </div>

        {/* Home Indicator */}
        <div className="h-6 w-full relative flex items-center justify-center bg-inherit">
          <div className="w-32 h-1.5 bg-black rounded-full opacity-30"></div>
        </div>
      </div>
    </div>
  );
};

export default MobileFrame;
