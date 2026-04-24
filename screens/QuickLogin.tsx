
import React, { useState } from 'react';
import { Edit2, CheckCircle2, Circle } from 'lucide-react';
import { Screen } from '../types';

interface QuickLoginProps {
  onNavigate: (screen: Screen) => void;
  onLogin: (phone: string) => void;
}

const QuickLogin: React.FC<QuickLoginProps> = ({ onNavigate, onLogin }) => {
  const [agreed, setAgreed] = useState(false);
  const phoneNumber = "188****9898";

  const handleQuickLogin = () => {
    if (!agreed) {
      alert("请先阅读并同意用户协议和隐私政策");
      return;
    }
    onLogin("18898989898");
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-50 via-purple-50 to-white overflow-y-auto">
      {/* Promotional Text */}
      <div className="px-8 pt-6 pb-6 text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-4 leading-relaxed">
          高效增收：一日多访客户信息<br />滴水不漏
        </h1>
        <p className="text-gray-500 text-sm leading-6">
          一天可以见多个客户确保“记”得住、“记”得全、“记”得好
        </p>
      </div>

      {/* 3D Illustration Placeholder */}
      <div className="flex-1 flex items-center justify-center relative px-8 min-h-[200px]">
        <div className="w-64 h-64 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full blur-3xl absolute opacity-30"></div>
        <img 
          src="https://picsum.photos/seed/shiba/400/400" 
          alt="登录页插图" 
          className="w-48 h-48 object-contain z-10 rounded-2xl shadow-lg border-4 border-white"
        />
      </div>

      {/* Login Actions Card */}
      <div className="bg-white rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] px-8 pt-10 pb-8 flex flex-col">
        <div className="flex items-center justify-center mb-8">
          <span className="text-3xl font-bold text-gray-800 tracking-wider">{phoneNumber}</span>
          <button onClick={() => onNavigate(Screen.SMS_LOGIN)} className="ml-3 p-1 text-gray-400 hover:text-blue-500">
            <Edit2 size={18} />
          </button>
        </div>

        <button 
          onClick={handleQuickLogin}
          className="w-full h-14 bg-[#4D4DFF] text-white rounded-full font-semibold text-lg shadow-lg active:scale-[0.98] transition-all mb-4"
        >
          本机号码一键登录
        </button>

        <button 
          onClick={() => onNavigate(Screen.SMS_LOGIN)}
          className="w-full h-14 bg-white text-[#4D4DFF] border-[1px] border-[#4D4DFF] rounded-full font-semibold text-lg active:scale-[0.98] transition-all"
        >
          验证码登录
        </button>

        {/* Agreement */}
        <div className="mt-6 flex items-start justify-center space-x-2">
          <button onClick={() => setAgreed(!agreed)} className="mt-0.5">
            {agreed ? (
              <CheckCircle2 size={16} className="text-blue-500" fill="currentColor" />
            ) : (
              <Circle size={16} className="text-gray-300" />
            )}
          </button>
          <p className="text-[12px] text-gray-500 leading-tight">
            我已阅读并同意 <span className="text-blue-500 font-medium">用户协议</span> 和 <span className="text-blue-500 font-medium">隐私政策</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickLogin;
