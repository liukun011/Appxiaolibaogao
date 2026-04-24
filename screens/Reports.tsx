
import React from 'react';
import { FileText, ChevronRight, Sparkles, Clock, Search, HelpCircle } from 'lucide-react';
import { InterviewRecord } from '../types';

interface ReportsProps {
  records: InterviewRecord[];
  onSelectRecord: (record: InterviewRecord) => void;
}

const Reports: React.FC<ReportsProps> = ({ records, onSelectRecord }) => {
  const reportRecords = records.filter(r => r.reportStatus === 'GENERATED');

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      <div className="px-6 pt-12 pb-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI 报告库</h2>
        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">已生成报告</p>
      </div>

      <div className="px-6 mb-4 mt-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text" 
            placeholder="搜索报告关键词..." 
            className="w-full h-11 pl-11 pr-4 bg-white rounded-2xl border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] px-1">全部历史报告</span>
          <HelpCircle size={14} className="text-slate-200" />
        </div>
        
        {reportRecords.length > 0 ? (
          reportRecords.map((record, i) => (
            <div 
              key={record.id}
              onClick={() => onSelectRecord(record)}
              className="bg-white p-5 rounded-[28px] shadow-sm border border-white active:scale-[0.98] transition-all group animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-[14px] leading-tight">{record.company}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{record.clientName}</p>
                  </div>
                </div>
                <div className="bg-blue-50 px-2 py-1 rounded-lg flex items-center space-x-1">
                  <Sparkles size={10} className="text-blue-500" />
                  <span className="text-[9px] font-black text-blue-600">AI 已解析</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50">
                <div className="flex items-center text-slate-300 space-x-1">
                  <Clock size={10} />
                  <span className="text-[10px] font-bold">{record.time}</span>
                </div>
                <div className="flex items-center text-blue-600 text-[11px] font-black space-x-1">
                  <span>查看详情</span>
                  <ChevronRight size={14} strokeWidth={3} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
              <FileText size={24} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">暂无生成的报告</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
