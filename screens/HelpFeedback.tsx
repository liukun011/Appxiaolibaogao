
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  PhoneCall, 
  Search,
  ChevronDown,
  Send,
  HelpCircle
} from 'lucide-react';

interface HelpFeedbackProps {
  onBack: () => void;
}

const HelpFeedback: React.FC<HelpFeedbackProps> = ({ onBack }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  const faqs = [
    { q: 'AI 生成报告需要多长时间？', a: '通常在 30 秒至 1 分钟内完成，取决于访谈时长和网络状况。' },
    { q: '如何修改已生成的报告内容？', a: '进入报告详情页，点击“更新内容并重新生成”，系统将根据您的修改再次进行 AI 解析。' },
    { q: '共创官积分如何获取？', a: '通过完成每日首访、提交模版优化建议以及邀请同事使用即可获得积分。' },
    { q: '录音文件会保存多久？', a: '默认保存在云端 180 天，归档后的文件将永久保存。' }
  ];

  return (
    <div className="absolute inset-0 z-[700] bg-slate-50 flex flex-col animate-slide-in">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-10">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-slate-800 active:scale-90"><ChevronLeft size={28} /></button>
        <h3 className="text-lg font-black text-slate-900">帮助与反馈</h3>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto pb-10">
        {/* Search */}
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="搜索问题..." 
              className="w-full h-12 pl-12 pr-4 bg-white rounded-2xl border border-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="px-6 mb-8">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">常见问题</p>
          <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm divide-y divide-slate-50">
            {faqs.map((faq, i) => (
              <div key={i} className="flex flex-col">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left active:bg-slate-50 transition-all"
                >
                  <span className="text-sm font-bold text-slate-700">{faq.q}</span>
                  <ChevronDown size={18} className={`text-slate-300 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === i && (
                  <div className="px-6 pb-5 animate-fade-in">
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="px-6 mb-8">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">问题与意见反馈</p>
          <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
            <textarea 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="请描述您遇到的问题或建议..."
              rows={4}
              className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 resize-none transition-all mb-4"
            />
            <button 
              disabled={!feedback.trim()}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-30 disabled:active:scale-100 transition-all"
            >
              <Send size={16} />
              <span>提交反馈</span>
            </button>
          </div>
        </div>

        {/* Contact Section */}
        <div className="px-6">
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white py-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col items-center active:scale-95 transition-all">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-3">
                <MessageSquare size={24} />
              </div>
              <span className="text-xs font-black text-slate-700">在线客服</span>
            </button>
            <button className="bg-white py-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col items-center active:scale-95 transition-all">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-3">
                <PhoneCall size={24} />
              </div>
              <span className="text-xs font-black text-slate-700">电话咨询</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default HelpFeedback;
