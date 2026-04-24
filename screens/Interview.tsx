
import React from 'react';
import { Filter, MessageSquare, Plus, Clock, MoreHorizontal } from 'lucide-react';
import { InterviewRecord } from '../types';

const Interview: React.FC = () => {
  const records: InterviewRecord[] = [
    { id: '1', clientName: '李总', company: '百度(中国)', status: 'SIGNED', time: '1小时前', summary: '对二期方案非常满意，已完成电子签。', orgId: 'org1' },
    { id: '2', clientName: '王经理', company: '美团外卖', status: 'FOLLOWING', time: '4小时前', summary: '价格敏感度较高，需要申请折扣权限。', orgId: 'org1' },
    { id: '3', clientName: '陈总', company: '字节跳动', status: 'PENDING', time: '昨天', summary: '初步沟通意向，下周预约面谈。', orgId: 'org1' },
    { id: '4', clientName: '张主管', company: '阿里巴巴', status: 'FOLLOWING', time: '2天前', summary: '技术对接中，反馈流畅度极佳。', orgId: 'org1' },
  ];

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">访谈记录</h2>
        <button className="p-2 bg-gray-100 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"><Filter size={20} /></button>
      </div>

      <div className="space-y-4 pb-4">
        {records.map((record) => (
          <div key={record.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 active:scale-[0.98] transition-transform cursor-pointer">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-400">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg tracking-tight">{record.clientName}</h4>
                  <p className="text-xs text-gray-400 font-black uppercase tracking-widest">{record.company}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center text-gray-300 space-x-1.5">
                  <Clock size={12} />
                  <span className="text-[10px] font-bold tracking-widest">{record.time}</span>
                </div>
                <button className="text-gray-200 hover:text-gray-400">
                  <MoreHorizontal size={22} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button className="absolute bottom-6 right-2 w-14 h-14 bg-[#4D4DFF] rounded-full flex items-center justify-center text-white shadow-[0_8px_24px_rgba(77,77,255,0.4)] active:scale-90 transition-transform z-50">
        <Plus size={32} />
      </button>
    </div>
  );
};

export default Interview;
