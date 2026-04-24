
import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Screen } from '../types';

interface SMSLoginProps {
  onNavigate: (screen: Screen) => void;
  onLogin: (phone: string) => void;
}

const SMSLogin: React.FC<SMSLoginProps> = ({ onNavigate, onLogin }) => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleGetCode = () => {
    if (phone.length !== 11) {
      alert("请输入正确的11位手机号");
      return;
    }
    setCountdown(60);
  };

  const handleLogin = () => {
    if (phone.length === 11 && code.length === 4) {
      onLogin(phone);
    } else {
      alert("请输入手机号和验证码");
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between">
        <button onClick={() => onNavigate(Screen.QUICK_LOGIN)} className="p-2 -ml-2">
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <h2 className="text-lg font-medium text-gray-800">手机验证码登录</h2>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      <div className="px-6 pt-12">
        <div className="bg-white rounded-[32px] p-8 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800 mb-2">手机验证码登录</h1>
          <p className="text-sm text-gray-400 mb-8">未注册的手机号登录成功后将自动注册</p>

          <div className="space-y-6">
            {/* Phone Input */}
            <div className="relative h-14 border border-blue-200 rounded-full px-6 flex items-center bg-white shadow-sm focus-within:ring-2 ring-blue-100 transition-all">
              <span className="text-gray-800 font-medium border-r border-gray-100 pr-4 mr-4">+86</span>
              <input 
                type="tel" 
                placeholder="请输入手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                className="flex-1 bg-transparent outline-none text-gray-800 placeholder:text-gray-300"
              />
            </div>

            {/* Code Input */}
            <div className="relative h-14 border border-blue-200 rounded-full px-6 flex items-center bg-white shadow-sm focus-within:ring-2 ring-blue-100 transition-all">
              <input 
                type="number" 
                placeholder="请输入验证码"
                value={code}
                onChange={(e) => setCode(e.target.value.slice(0, 4))}
                className="flex-1 bg-transparent outline-none text-gray-800 placeholder:text-gray-300"
              />
              <button 
                onClick={handleGetCode}
                disabled={countdown > 0}
                className={`text-sm font-medium ${countdown > 0 ? 'text-gray-300' : 'text-[#4D4DFF]'} whitespace-nowrap`}
              >
                {countdown > 0 ? `${countdown}s后重试` : '获取验证码'}
              </button>
            </div>

            <button 
              onClick={handleLogin}
              className="w-full h-14 bg-[#4D4DFF] text-white rounded-full font-semibold text-lg shadow-lg active:scale-[0.98] transition-all mt-4"
            >
              登 录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSLogin;
