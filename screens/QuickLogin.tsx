import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import AppToast from '../components/AppToast';
import { Screen } from '../types';

interface QuickLoginProps {
  onNavigate: (screen: Screen) => void;
  onLogin: (phone: string) => void;
}

type LoginMode = 'sms' | 'password';

const QuickLogin: React.FC<QuickLoginProps> = ({ onNavigate, onLogin }) => {
  const [mode, setMode] = useState<LoginMode>('sms');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
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

  const validateAgreement = () => {
    if (!agreed) {
      setToast('请先阅读并同意用户协议和隐私政策');
      return false;
    }
    return true;
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

  const handleLogin = () => {
    if (!validateAgreement()) return;

    if (mode === 'sms') {
      if (phone.length !== 11 || code.length < 4) {
        setToast('请输入手机号和验证码');
        return;
      }
    } else if (phone.length !== 11 || password.length < 6) {
      setToast('请输入手机号和至少6位密码');
      return;
    }

    onLogin(phone);
  };

  return (
    <div className="relative h-full flex flex-col overflow-hidden bg-[#EEF1FF]">
      <AppToast message={toast} />
      <section className="relative shrink-0 px-8 pt-7 text-center">
        <h1 className="text-[24px] font-bold leading-[1.34] text-[#3F3BC5]">
          你的自由，不该被困在无尽的报告里
        </h1>
        <p className="mx-auto mt-3 max-w-[300px] text-[14px] font-medium leading-6 text-slate-500">
          把时间还给生活，让高效成为习惯，乐享每一天
        </p>

        <div className="relative mx-auto mt-3 h-[178px] w-[248px]">
          <img
            src="/login-illustration.svg"
            alt="登录页插画"
            className="absolute inset-x-0 bottom-0 mx-auto h-[178px] w-[220px] object-contain drop-shadow-[0_18px_26px_rgba(98,91,198,0.14)]"
          />
        </div>
      </section>

      <section className="-mt-1 flex-1 rounded-t-[32px] bg-white px-8 pt-7 shadow-[0_-14px_36px_rgba(75,69,156,0.08)]">
        <div className="mb-5 flex gap-8">
          <button
            type="button"
            onClick={() => setMode('sms')}
            className={`relative pb-3 text-[20px] font-bold transition-colors ${
              mode === 'sms' ? 'text-slate-950' : 'text-slate-400'
            }`}
          >
            手机号登录
            {mode === 'sms' && (
              <span className="absolute bottom-0 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-[#4A3FD3]" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setMode('password')}
            className={`relative pb-3 text-[20px] font-bold transition-colors ${
              mode === 'password' ? 'text-slate-950' : 'text-slate-400'
            }`}
          >
            密码登录
            {mode === 'password' && (
              <span className="absolute bottom-0 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-[#4A3FD3]" />
            )}
          </button>
        </div>

        <div className="space-y-3">
          <label className="flex h-[52px] items-center rounded-full border border-[#B9B8EF] px-6 transition focus-within:border-[#736BE3] focus-within:ring-4 focus-within:ring-[#736BE3]/10">
            <span className="mr-5 pr-5 text-[17px] font-semibold text-slate-950">+86</span>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(event) => handlePhoneChange(event.target.value)}
              placeholder="请输入手机号"
              className="min-w-0 flex-1 bg-transparent text-[15px] font-normal text-slate-900 outline-none placeholder:text-slate-400"
            />
          </label>

          {mode === 'sms' ? (
            <label className="flex h-[52px] items-center rounded-full border border-[#B9B8EF] px-6 transition focus-within:border-[#736BE3] focus-within:ring-4 focus-within:ring-[#736BE3]/10">
              <input
                type="tel"
                inputMode="numeric"
                value={code}
                onChange={(event) => handleCodeChange(event.target.value)}
                placeholder="请输入验证码"
                className="min-w-0 flex-1 bg-transparent text-[15px] font-normal text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={handleGetCode}
                disabled={countdown > 0}
                className="ml-4 shrink-0 text-[15px] font-semibold text-[#3E35C9] disabled:text-slate-300"
              >
                {countdown > 0 ? `${countdown}s后重试` : '获取验证码'}
              </button>
            </label>
          ) : (
            <>
              <label className="flex h-[52px] items-center rounded-full border border-[#B9B8EF] px-6 transition focus-within:border-[#736BE3] focus-within:ring-4 focus-within:ring-[#736BE3]/10">
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value.slice(0, 32))}
                  placeholder="请输入密码"
                  className="min-w-0 flex-1 bg-transparent text-[15px] font-normal text-slate-900 outline-none placeholder:text-slate-400"
                />
              </label>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onNavigate(Screen.RESET_PASSWORD)}
                  className="text-[13px] font-medium text-[#3E35C9]"
                >
                  忘记密码？重置密码
                </button>
              </div>
            </>
          )}
        </div>

        {mode === 'sms' && (
          <p className="mt-5 text-[13px] font-normal leading-5 text-slate-500">
            未注册的手机号登录成功后将自动注册
          </p>
        )}

        <button
          type="button"
          onClick={handleLogin}
          className="mt-7 h-[52px] w-full rounded-full bg-[#9B96E5] text-[18px] font-bold tracking-[0.18em] text-white shadow-[0_14px_24px_rgba(90,82,207,0.22)] transition active:scale-[0.98]"
        >
          登录
        </button>

        <div className="mt-6 flex items-center justify-center gap-3 pb-4">
          <button
            type="button"
            onClick={() => setAgreed((current) => !current)}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
            aria-label={agreed ? '取消同意协议' : '同意协议'}
          >
            {agreed ? (
              <CheckCircle2 size={21} className="text-[#3E35C9]" fill="currentColor" />
            ) : (
              <Circle size={21} className="text-[#2F2BB8]" />
            )}
          </button>
          <p className="text-[13px] font-normal leading-5 text-slate-500">
            我已阅读并同意
            <span className="mx-1 font-medium text-[#3028B8]">用户协议</span>
            和
            <span className="ml-1 font-medium text-[#3028B8]">隐私政策</span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default QuickLogin;
