
import React from 'react';
import { LayoutDashboard, Users, Calendar, TrendingUp, Search, Bell, Plus } from 'lucide-react';

interface DashboardProps {
  phone: string;
}

const Dashboard: React.FC<DashboardProps> = ({ phone }) => {
  const stats = [
    { label: '今日拜访', value: '8', icon: <Users className="text-blue-500" /> },
    { label: '预计收益', value: '¥1,250', icon: <TrendingUp className="text-green-500" /> },
    { label: '待办任务', value: '4', icon: <Calendar className="text-orange-500" /> },
  ];

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
            {phone.slice(-2)}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">欢迎回来</h3>
            <p className="text-xs text-gray-500">{phone}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="p-2 bg-slate-50 rounded-full"><Search size={20} /></button>
          <button className="p-2 bg-slate-50 rounded-full relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-50">
              <div className="mb-2">{stat.icon}</div>
              <div className="text-lg font-bold text-gray-800">{stat.value}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Action Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl">
          <h4 className="text-lg font-bold mb-1">智能分析已就绪</h4>
          <p className="text-blue-100 text-sm mb-4">基于您今日的5次有效访谈，我们为您生成了客户意向报告。</p>
          <button className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-lg text-sm font-medium">
            查看报告
          </button>
        </div>

        {/* Client List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-800">最近访谈</h4>
            <button className="text-sm text-blue-600 font-medium">查看全部</button>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl flex items-center space-x-4 shadow-sm border border-slate-50">
                <img src={`https://picsum.photos/seed/user${i}/100/100`} className="w-12 h-12 rounded-full" alt="avatar" />
                <div className="flex-1">
                  <h5 className="text-sm font-semibold text-gray-800">张经理 - 华润万家</h5>
                  <p className="text-xs text-gray-400">上次访问: 2小时前 · 已签约</p>
                </div>
                <div className="text-blue-500"><Plus size={20} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white border-t border-slate-100 h-20 flex items-center justify-around px-4 pb-4">
        <button className="flex flex-col items-center space-y-1 text-blue-600">
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-medium">首页</span>
        </button>
        <button className="flex flex-col items-center space-y-1 text-gray-400">
          <Users size={24} />
          <span className="text-[10px] font-medium">客户</span>
        </button>
        <button className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg -mt-8 border-4 border-white">
          <Plus size={28} />
        </button>
        <button className="flex flex-col items-center space-y-1 text-gray-400">
          <Calendar size={24} />
          <span className="text-[10px] font-medium">日程</span>
        </button>
        <button className="flex flex-col items-center space-y-1 text-gray-400">
          <TrendingUp size={24} />
          <span className="text-[10px] font-medium">报表</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
