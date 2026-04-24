
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Bell, 
  Smartphone, 
  Trash2, 
  Info,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';

interface GeneralSettingsProps {
  onBack: () => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ onBack }) => {
  const [notifications, setNotifications] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [cacheSize, setCacheSize] = useState('24.8 MB');
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleClearCache = () => {
    setIsClearing(true);
    setTimeout(() => {
      setCacheSize('0 KB');
      setIsClearing(false);
    }, 1500);
  };

  const ChangePasswordOverlay = () => {
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleUpdate = () => {
      if (!oldPass || !newPass || !confirmPass) return;
      if (newPass !== confirmPass) {
        alert("两次输入的新密码不一致");
        return;
      }
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setIsSuccess(true);
        setTimeout(() => setShowChangePassword(false), 1500);
      }, 1500);
    };

    return (
      <div className="absolute inset-0 z-[800] bg-white flex flex-col animate-slide-up">
        <div className="pt-12 pb-6 px-6 flex items-center justify-between border-b border-slate-50">
          <button onClick={() => setShowChangePassword(false)} className="w-10 h-10 flex items-center justify-center text-slate-800 active:scale-90">
            <ChevronLeft size={28} />
          </button>
          <h3 className="text-lg font-black text-slate-900">修改登录密码</h3>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 p-8 space-y-8 overflow-y-auto">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[32px] flex items-center justify-center mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">修改成功</h4>
              <p className="text-sm text-slate-400 font-bold">请妥善保管您的新密码</p>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">原密码</label>
                  <div className="relative">
                    <input 
                      type={showPass ? "text" : "password"}
                      value={oldPass}
                      onChange={(e) => setOldPass(e.target.value)}
                      placeholder="请输入当前使用的密码"
                      className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-[24px] px-6 font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
                    />
                    <button 
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300"
                    >
                      {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">新密码</label>
                  <input 
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="请输入 8-16 位新密码"
                    className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-[24px] px-6 font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">确认新密码</label>
                  <input 
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="请再次输入新密码"
                    className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-[24px] px-6 font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <button 
                onClick={handleUpdate}
                disabled={!oldPass || !newPass || !confirmPass || isSaving}
                className="w-full py-5 bg-slate-900 text-white rounded-[28px] font-black text-sm flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-30 transition-all shadow-xl shadow-slate-200"
              >
                {isSaving ? "正在更新密码..." : "确认修改"}
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const SettingRow = ({ icon, label, rightElement, onClick }: any) => (
    <button 
      onClick={onClick}
      className="w-full px-6 py-5 flex items-center justify-between active:bg-slate-50 transition-all text-left group"
    >
      <div className="flex items-center space-x-4">
        <div className="text-slate-400 group-active:scale-90 transition-transform">{icon}</div>
        <span className="text-sm font-bold text-slate-700">{label}</span>
      </div>
      {rightElement || <ChevronRight size={18} className="text-slate-200" />}
    </button>
  );

  return (
    <div className="absolute inset-0 z-[700] bg-slate-50 flex flex-col animate-slide-in">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-10">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-slate-800 active:scale-90">
          <ChevronLeft size={28} />
        </button>
        <h3 className="text-lg font-black text-slate-900">通用设置</h3>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        {/* Account Section */}
        <div className="px-6 mb-6">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 px-1">账号与安全</p>
          <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm divide-y divide-slate-50">
            <SettingRow icon={<Smartphone size={18} />} label="修改绑定手机" />
            <SettingRow 
              icon={<Lock size={18} />} 
              label="修改登录密码" 
              onClick={() => setShowChangePassword(true)}
            />
            <SettingRow icon={<ShieldCheck size={18} />} label="账号安全等级" rightElement={
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-black text-emerald-500 uppercase">高安全</span>
                <ChevronRight size={18} className="text-slate-200" />
              </div>
            } />
          </div>
        </div>

        {/* Preferences Section */}
        <div className="px-6 mb-6">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 px-1">偏好设置</p>
          <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm divide-y divide-slate-50">
            <SettingRow icon={<Bell size={18} />} label="消息推送" rightElement={
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-all relative ${notifications ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'}`} />
              </button>
            } />
            <SettingRow icon={<ExternalLink size={18} />} label="系统权限管理" />
          </div>
        </div>

        {/* Data Section */}
        <div className="px-6 mb-6">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 px-1">数据与清理</p>
          <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
            <SettingRow icon={<Trash2 size={18} />} label="清理本地缓存" onClick={handleClearCache} rightElement={
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-slate-400">{isClearing ? '正在清理...' : cacheSize}</span>
                <ChevronRight size={18} className="text-slate-200" />
              </div>
            } />
          </div>
        </div>

        {/* About Section */}
        <div className="px-6 mb-10">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 px-1">关于</p>
          <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm divide-y divide-slate-50">
            <SettingRow icon={<Info size={18} />} label="检查版本更新" rightElement={
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-black text-slate-300">V 2.4.0</span>
                <ChevronRight size={18} className="text-slate-200" />
              </div>
            } />
            <SettingRow icon={<FileText size={18} />} label="服务协议与隐私政策" />
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center opacity-20 py-4">
          <p className="text-[10px] font-black tracking-[0.4em] text-slate-900">小力报告 AI</p>
        </div>
      </div>

      {showChangePassword && <ChangePasswordOverlay />}

      <style>{`
        @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

const FileText = ({ size, className }: any) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);

export default GeneralSettings;
