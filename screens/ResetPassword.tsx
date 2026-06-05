import React, { useEffect, useState } from 'react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import AppToast from '../components/AppToast';
import { Screen } from '../types';

interface ResetPasswordProps {
  onNavigate: (screen: Screen) => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onNavigate }) => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = window.setInterval(() => {
      setCountdown((current) => current - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast('');
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const handlePhoneChange = (value: string) => {
    setPhone(value.replace(/\D/g, '').slice(0, 11));
  };

  const handleCodeChange = (value: string) => {
    setCode(value.replace(/\D/g, '').slice(0, 6));
  };

  const handleGetCode = () => {
    if (!phone) {
      setToast('请先输入手机号');
      return;
    }

    if (phone.length !== 11) {
      setToast('请输入正确的11位手机号');
      return;
    }

    setCountdown(60);
  };

  const handleSubmit = () => {
    if (phone.length !== 11) {
      setToast('请输入正确的手机号');
      return;
    }

    if (code.length !== 6) {
      setToast('请输入6位验证码');
      return;
    }

    if (password.length < 6) {
      setToast('请输入至少6位新密码');
      return;
    }

    if (password !== confirmPassword) {
      setToast('两次输入的新密码不一致');
      return;
    }

    setToast('密码已重置，请重新登录');
    window.setTimeout(() => {
      onNavigate(Screen.QUICK_LOGIN);
    }, 900);
  };

  return (
    <div className="relative h-full overflow-hidden bg-white px-7 pt-7">
      <AppToast message={toast} />
      <button
        type="button"
        onClick={() => onNavigate(Screen.QUICK_LOGIN)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-900 active:bg-slate-100"
        aria-label="返回"
      >
        <ChevronLeft size={32} strokeWidth={2.5} />
      </button>

      <h1 className="mt-[96px] text-center text-[30px] font-bold leading-none text-slate-900">
        重置密码
      </h1>

      <div className="mt-[88px] space-y-5">
        <label className="flex h-[58px] items-center rounded-[18px] border border-slate-200 px-5 transition focus-within:border-[#9B96E5] focus-within:ring-4 focus-within:ring-[#9B96E5]/10">
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(event) => handlePhoneChange(event.target.value)}
            placeholder="请输入手机号"
            className="min-w-0 flex-1 bg-transparent text-[16px] font-normal text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>

        <label className="flex h-[58px] items-center rounded-[18px] border border-slate-200 px-5 transition focus-within:border-[#9B96E5] focus-within:ring-4 focus-within:ring-[#9B96E5]/10">
          <input
            type="tel"
            inputMode="numeric"
            value={code}
            onChange={(event) => handleCodeChange(event.target.value)}
            placeholder="请输入6位验证码"
            className="min-w-0 flex-1 bg-transparent text-[16px] font-normal text-slate-900 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={handleGetCode}
            disabled={countdown > 0}
            className="ml-4 shrink-0 text-[15px] font-semibold text-[#0E6CEB] disabled:text-slate-300"
          >
            {countdown > 0 ? `${countdown}s后重试` : '获取验证码'}
          </button>
        </label>

        <label className="flex h-[58px] items-center rounded-[18px] border border-slate-200 px-5 transition focus-within:border-[#9B96E5] focus-within:ring-4 focus-within:ring-[#9B96E5]/10">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value.slice(0, 32))}
            placeholder="请输入新密码"
            className="min-w-0 flex-1 bg-transparent text-[16px] font-normal text-slate-900 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="ml-4 text-slate-400"
            aria-label={showPassword ? '隐藏新密码' : '显示新密码'}
          >
            {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
          </button>
        </label>

        <label className="flex h-[58px] items-center rounded-[18px] border border-slate-200 px-5 transition focus-within:border-[#9B96E5] focus-within:ring-4 focus-within:ring-[#9B96E5]/10">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value.slice(0, 32))}
            placeholder="请再次输入新密码"
            className="min-w-0 flex-1 bg-transparent text-[16px] font-normal text-slate-900 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((current) => !current)}
            className="ml-4 text-slate-400"
            aria-label={showConfirmPassword ? '隐藏确认密码' : '显示确认密码'}
          >
            {showConfirmPassword ? <Eye size={22} /> : <EyeOff size={22} />}
          </button>
        </label>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="mt-[72px] h-[58px] w-full rounded-full bg-[#9B96E5] text-[20px] font-bold tracking-[0.12em] text-white shadow-[0_14px_24px_rgba(90,82,207,0.22)] transition active:scale-[0.98]"
      >
        确定
      </button>
    </div>
  );
};

export default ResetPassword;
