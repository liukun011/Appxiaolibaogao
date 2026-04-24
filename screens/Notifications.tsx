
import React from 'react';
import { X, Bell, MessageSquare, Info, ShieldAlert, CheckCircle2, Trash2 } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'update' | 'alert' | 'success' | 'message';
  title: string;
  content: string;
  time: string;
  unread: boolean;
  relatedId?: string; // 关联的业务ID，如访谈记录ID
}

interface NotificationsProps {
  onClose: () => void;
  onNotificationClick: (notif: Notification) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ onClose, onNotificationClick }) => {
  const [notifs, setNotifs] = React.useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: '报告生成成功',
      content: '“百度(中国) - 李总”的访谈报告已由 AI 深度解析完成，快去查看吧。',
      time: '12:30',
      unread: true,
      relatedId: '1' // 对应李总的记录ID
    },
    {
      id: '2',
      type: 'alert',
      title: '合规性提醒',
      content: '检测到您的模版包含过期的业务术语，建议尽快更新模版库。',
      time: '10:15',
      unread: true
    },
    {
      id: '3',
      type: 'message',
      title: '访谈助手消息',
      content: '今日还有 2 场访谈待进行，AI 已经为您准备好了相关背景资料。',
      time: '09:00',
      unread: false
    }
  ]);

  const markAllRead = () => {
    setNotifs(notifs.map(n => ({ ...n, unread: false })));
  };

  const deleteNotif = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止触发卡片点击
    setNotifs(notifs.filter(n => n.id !== id));
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-emerald-500" size={20} />;
      case 'alert': return <ShieldAlert className="text-amber-500" size={20} />;
      case 'message': return <MessageSquare className="text-blue-500" size={20} />;
      default: return <Info className="text-slate-400" size={20} />;
    }
  };

  return (
    <div className="absolute inset-0 z-[500] bg-slate-50 flex flex-col animate-slide-up">
      {/* 顶部标题栏 */}
      <div className="px-6 pt-12 pb-6 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Bell size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 leading-none">通知中心</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">通知</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 active:scale-90 transition-transform"
        >
          <X size={20} />
        </button>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">最新消息</span>
          <button 
            onClick={markAllRead}
            className="text-[11px] font-black text-blue-600 hover:text-blue-700 active:opacity-60"
          >
            全标已读
          </button>
        </div>

        {notifs.length > 0 ? (
          notifs.map((notif, idx) => (
            <div 
              key={notif.id}
              onClick={() => onNotificationClick(notif)}
              className={`bg-white rounded-[28px] p-5 border border-white shadow-sm transition-all animate-fade-in flex items-start space-x-4 relative overflow-hidden active:scale-[0.98] group cursor-pointer`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {notif.unread && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
              )}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                notif.unread ? 'bg-slate-50' : 'bg-slate-50/50 grayscale opacity-60'
              }`}>
                {getTypeIcon(notif.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-black ${notif.unread ? 'text-slate-900' : 'text-slate-400'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-300">{notif.time}</span>
                </div>
                <p className={`text-[12px] leading-relaxed mt-1 ${notif.unread ? 'text-slate-500' : 'text-slate-400'}`}>
                  {notif.content}
                </p>
              </div>
              <button 
                onClick={(e) => deleteNotif(notif.id, e)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-400 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center opacity-30 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Bell size={32} />
            </div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">暂时没有新通知</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default Notifications;
