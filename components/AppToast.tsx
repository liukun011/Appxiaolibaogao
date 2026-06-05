import React from 'react';

interface AppToastProps {
  message: string;
}

const AppToast: React.FC<AppToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-8 z-[80] flex justify-center px-8">
      <div className="animate-fade-in max-w-[280px] rounded-[14px] bg-[#2F3442] px-5 py-3 text-center text-[14px] font-medium leading-5 text-white shadow-[0_12px_28px_rgba(24,31,47,0.26)] ring-1 ring-white/10">
        {message}
      </div>
    </div>
  );
};

export default AppToast;
