import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Clock, 
  Bell,
  ArrowUp,
  ChevronRight,
  Zap,
  FileSearch,
  FileCheck,
  Search,
  Building2,
  ChevronDown,
  Check
} from 'lucide-react';
import { InterviewRecord, Tab, User } from '../types';

interface HomeProps {
  user: User;
  onSwitchOrg: (orgId: string) => void;
  onNavigate: (tab: Tab, intent?: 'templates' | 'questionnaire' | 'org_management') => void;
  records: (InterviewRecord & { archived: boolean })[];
  onSelectRecord: (record: InterviewRecord) => void;
  onOpenNotifications: () => void;
}

const Home: React.FC<HomeProps> = ({ user, onSwitchOrg, onNavigate, records, onSelectRecord, onOpenNotifications }) => {
  const [activeCategory, setActiveCategory] = useState<'unfiled' | 'archived'>('unfiled');
  const [hasUnread, setHasUnread] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showOrgSwitcher, setShowOrgSwitcher] = useState(false);
  
  const activeOrg = user.organizations.find(o => o.id === user.activeOrgId) || user.organizations[0];
  
  const [currentBanner, setCurrentBanner] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const banners = [
    {
      title: "极致提升访谈效率",
      desc: "AI 实时转写与重点摘要",
      tag: "高效",
      icon: <Zap size={22} />,
      color: "from-indigo-600 to-blue-700",
    },
    {
      title: "AI 智能资料分析",
      desc: "深度挖掘访谈细节",
      tag: "智能分析",
      icon: <FileSearch size={22} />,
      color: "from-purple-600 to-indigo-800",
    },
    {
      title: "一键生成专业报告",
      desc: "秒级输出标准外发报告",
      tag: "一键报告",
      icon: <FileCheck size={22} />,
      color: "from-emerald-600 to-teal-800",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const filteredRecords = records.filter(r => activeCategory === 'archived' ? r.archived : !r.archived);

  return (
    <div className="h-full bg-slate-50 relative flex flex-col">
      {showOrgSwitcher && (
        <div className="absolute inset-0 z-[500] animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => setShowOrgSwitcher(false)}
          />
          <div className="absolute top-20 left-5 right-5 bg-white rounded-[32px] shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-slate-50">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">切换组织</h4>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-2">
              {user.organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    onSwitchOrg(org.id);
                    setShowOrgSwitcher(false);
                  }}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${
                    user.activeOrgId === org.id ? 'bg-blue-50' : 'active:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      user.activeOrgId === org.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Building2 size={20} />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-bold ${user.activeOrgId === org.id ? 'text-blue-600' : 'text-slate-700'}`}>
                        {org.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{org.role}</p>
                    </div>
                  </div>
                  {user.activeOrgId === org.id && <Check size={18} className="text-blue-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* 滚动容器 - 优化 pt 为更小的 pt-6 */}
      <div 
        ref={scrollContainerRef} 
        className="flex-1 overflow-y-auto smooth-scroll no-scrollbar px-5 pt-6 pb-32"
        onScroll={(e) => setShowBackToTop(e.currentTarget.scrollTop > 300)}
      >
        {/* Header - 优化为左右布局，左侧显示简洁欢迎语，右侧通知 */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <button 
              onClick={() => setShowOrgSwitcher(true)}
              className="flex items-center space-x-2 group active:opacity-70 transition-opacity"
            >
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{activeOrg.name}</h2>
              <div className="w-5 h-5 bg-slate-100 rounded-md flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <ChevronDown size={14} />
              </div>
            </button>
            <p className="text-[10px] font-bold text-slate-400 mt-0.5 tracking-wider">让访谈更简单、更专业</p>
          </div>
          <button 
            onClick={onOpenNotifications} 
            className="w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-600 active:scale-90 transition-all relative border border-slate-100/50"
          >
            <Bell size={22} strokeWidth={2.2} />
            {hasUnread && <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
          </button>
        </div>

        {/* Carousel - 保持 140px，缩减底部间距 */}
        <div className="relative mb-6 h-[140px] rounded-[32px] overflow-hidden shadow-[0_15px_35px_-10px_rgba(59,130,246,0.15)] group active:scale-[0.98] transition-all cursor-pointer">
          <div 
            className="flex h-full transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1)"
            style={{ transform: `translateX(-${currentBanner * 100}%)` }}
          >
            {banners.map((banner, idx) => (
              <div key={idx} className="min-w-full h-full">
                <div className={`bg-gradient-to-br ${banner.color} h-full p-5 text-white flex flex-col justify-between relative`}>
                  <div className="absolute -right-4 -top-4 w-28 h-28 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[8px] font-black tracking-widest bg-white/20 px-2 py-0.5 rounded-md uppercase">{banner.tag}</span>
                      <h4 className="text-lg font-black leading-tight">{banner.title}</h4>
                      <p className="text-[11px] text-white/70 font-medium max-w-[200px]">{banner.desc}</p>
                    </div>
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                      {banner.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-6 flex space-x-1">
            {banners.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${currentBanner === i ? 'w-4 bg-white' : 'w-1 bg-white/30'}`} />
            ))}
          </div>
        </div>

        {/* 搜索框 - 新增搜索框以填充空间并增强功能感 */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="搜索访谈或客户..." 
              className="w-full h-12 pl-12 pr-4 bg-white rounded-2xl border border-slate-100 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Categories Section - 优化吸顶间距 */}
        <div className="sticky top-0 z-[40] bg-slate-50/80 backdrop-blur-lg py-3 -mx-5 px-5 mb-4">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-black text-slate-900 tracking-tight">最近访谈</h3>
             <button className="text-[11px] font-black text-blue-600 uppercase tracking-widest">查看全部</button>
          </div>
          <div className="bg-slate-200/40 p-1 rounded-2xl flex relative">
            <button 
              onClick={() => setActiveCategory('unfiled')} 
              className={`flex-1 py-3 text-xs font-black z-10 transition-colors ${activeCategory === 'unfiled' ? 'text-blue-600' : 'text-slate-400'}`}
            >待处理</button>
            <button 
              onClick={() => setActiveCategory('archived')} 
              className={`flex-1 py-3 text-xs font-black z-10 transition-colors ${activeCategory === 'archived' ? 'text-slate-800' : 'text-slate-400'}`}
            >已归档</button>
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-transform duration-300 ease-out ${activeCategory === 'archived' ? 'translate-x-[calc(100%+0px)]' : 'translate-x-0'}`}
            />
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredRecords.map((record, i) => (
            <div 
              key={record.id} 
              onClick={() => onSelectRecord(record)}
              className="bg-white p-5 rounded-[28px] shadow-[0_4px_12px_-4px_rgba(0,0,0,0.03)] border border-white active:scale-[0.97] active:bg-slate-50 transition-all group flex items-center justify-between animate-fade-in"
              style={{ animationDelay: `${(i + 2) * 0.05}s` }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 group-active:scale-90 transition-transform">
                  <MessageSquare size={22} strokeWidth={2.5} />
                </div>
                <div className="max-w-[160px]">
                  <h5 className="font-black text-slate-800 text-[15px] truncate">{record.company}</h5>
                  <p className="text-[10px] font-bold text-slate-300 uppercase truncate mt-0.5 tracking-wider">{record.clientName}</p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1.5">
                <span className="text-[10px] font-black text-slate-300 flex items-center space-x-1 uppercase">
                  <Clock size={10} /> <span>{record.time}</span>
                </span>
                <div className="px-2 py-0.5 bg-slate-50 rounded-md border border-slate-100">
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
              </div>
            </div>
          ))}
          {filteredRecords.length === 0 && (
            <div className="py-20 text-center opacity-40">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell size={24} className="text-slate-300" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">暂无记录</p>
            </div>
          )}
        </div>
      </div>

      {showBackToTop && (
        <button 
          onClick={() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          className="absolute bottom-32 right-6 w-12 h-12 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center z-[50] animate-bounce active:scale-90 transition-transform"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default Home;