
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  ChevronRight, 
  Award, 
  HelpCircle, 
  LogOut, 
  ChevronLeft, 
  Camera,
  Zap,
  Trophy,
  Star,
  Gift,
  Crown,
  TrendingUp,
  ShieldCheck,
  Copy,
  Users,
  Building2,
  Check,
  Plus,
  Share2,
  Search,
  MoreHorizontal,
  Shield,
  ShieldAlert,
  UserPlus,
  ChevronDown,
  Edit3,
  BriefcaseBusiness
} from 'lucide-react';
import HelpFeedback from './HelpFeedback';
import GeneralSettings from './GeneralSettings';
import AppToast from '../components/AppToast';
import { User, Organization, OrgSettings } from '../types';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onSwitchOrg: (orgId: string) => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  intent?: 'templates' | 'questionnaire' | 'org_management' | null;
  onClearIntent?: () => void;
  onOverlayChange?: (open: boolean) => void;
}

const EditProfileOverlay: React.FC<{
  userName: string;
  userAvatar: string;
  onClose: () => void;
  onSave: (name: string, avatar: string) => void;
}> = ({ userName, userAvatar, onClose, onSave }) => {
  const [tempName, setTempName] = useState(userName);
  const [tempAvatar, setTempAvatar] = useState(userAvatar);

  const handleSave = () => {
    onSave(tempName, tempAvatar);
  };

  const refreshAvatar = () => {
    setTempAvatar(`https://picsum.photos/seed/${Date.now()}/200/200`);
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-[600] bg-white flex flex-col"
    >
      <div className="pt-12 pb-6 px-6 flex items-center justify-between border-b border-slate-50">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-800 active:scale-90"><ChevronLeft size={28} /></button>
        <h3 className="text-lg font-black text-slate-900">编辑资料</h3>
        <button onClick={handleSave} className="text-blue-600 font-bold active:scale-90 transition-all">完成</button>
      </div>

      <div className="flex-1 p-8 flex flex-col items-center space-y-10">
        <div className="relative">
          <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-slate-50 shadow-2xl relative">
            <img src={tempAvatar} className="w-full h-full object-cover" alt="preview" />
          </div>
          <button 
            onClick={refreshAvatar}
            className="absolute bottom-[-10px] right-[-10px] w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all"
          >
            <Camera size={20} />
          </button>
        </div>

        <div className="w-full space-y-3">
          <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">您的昵称</label>
          <input 
            type="text" 
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-[24px] px-6 font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
            placeholder="输入昵称"
          />
        </div>
      </div>
    </motion.div>
  );
};


const CoCreationOverlay: React.FC<{
  userLevel: { current: number; title: string; points: number; nextThreshold: number; color: string };
  rankingData: { rank: number; name: string; points: number; avatar: string; level: string }[];
  onClose: () => void;
}> = ({ userLevel, rankingData, onClose }) => (
  <motion.div 
    initial={{ y: '100%' }}
    animate={{ y: 0 }}
    exit={{ y: '100%' }}
    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    className="absolute inset-0 z-[600] bg-slate-50 flex flex-col"
  >
    <div className="pt-12 pb-6 px-6 flex items-center justify-between bg-white border-b border-slate-100">
      <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-800 active:scale-90"><ChevronLeft size={28} /></button>
      <h3 className="text-lg font-black text-slate-900">等级与荣誉</h3>
      <div className="w-10"></div>
    </div>

    <div className="flex-1 overflow-y-auto pb-10">
      {/* 当前等级进度 */}
      <div className="p-6">
        <div className={`bg-gradient-to-br ${userLevel.color} rounded-[40px] p-8 text-white shadow-2xl shadow-purple-200 relative overflow-hidden`}>
          <div className="absolute top-[-20px] right-[-20px] opacity-10"><Crown size={120} strokeWidth={1} /></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] font-black tracking-widest uppercase text-white/60">当前等级</p>
                <h4 className="text-2xl font-black italic">LV.{userLevel.current} {userLevel.title}</h4>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                <TrendingUp size={28} />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-wider">成长进度</span>
                <span className="text-[10px] font-black">{userLevel.points} / {userLevel.nextThreshold}</span>
              </div>
              <div className="w-full h-3 bg-black/10 rounded-full overflow-hidden p-[2px]">
                 <div 
                  className="h-full bg-white rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${(userLevel.points / userLevel.nextThreshold) * 100}%` }}
                 />
              </div>
              <p className="text-[9px] font-bold text-white/60 italic mt-1">距离 LV.4 荣耀共创官 还差 {userLevel.nextThreshold - userLevel.points} 积分</p>
            </div>
          </div>
        </div>
      </div>

      {/* 等级奖励机制 */}
      <div className="px-6 mb-8">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">等级权益介绍</p>
        <div className="grid grid-cols-1 gap-3">
          {[
            { lv: 'L1-L2', title: '见习/先锋', desc: '新功能内测资格、专属标识', active: true },
            { lv: 'L3', title: '核心共创官', desc: '定制访谈模版权限、积分双倍', active: true },
            { lv: 'L4-L5', title: '荣耀/至尊', desc: '线下沙龙特邀、专属1V1管家服务', active: false }
          ].map((benefit, i) => (
            <div key={i} className={`p-5 rounded-[24px] border flex items-center justify-between ${benefit.active ? 'bg-white border-slate-100' : 'bg-slate-50 border-transparent opacity-60'}`}>
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${benefit.active ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-200 text-slate-400'}`}>
                  {benefit.active ? <ShieldCheck size={20} /> : <Gift size={20} />}
                </div>
                <div>
                  <h5 className="text-[13px] font-black text-slate-800">{benefit.title} <span className="text-[9px] text-slate-400 font-bold ml-1">{benefit.lv}</span></h5>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{benefit.desc}</p>
                </div>
              </div>
              {!benefit.active && <div className="text-[8px] font-black bg-slate-200 text-slate-400 px-2 py-1 rounded-md">未解锁</div>}
            </div>
          ))}
        </div>
      </div>

      {/* 实时排名 */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">小狸共创官排名</p>
          <span className="text-[9px] font-black text-slate-400">实时更新</span>
        </div>
        <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm divide-y divide-slate-50">
          {rankingData.map((user, i) => (
            <div key={i} className="px-5 py-4 flex items-center justify-between animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                  user.rank === 1 ? 'bg-yellow-100 text-yellow-600' : 
                  user.rank === 2 ? 'bg-slate-100 text-slate-500' : 
                  user.rank === 3 ? 'bg-orange-50 text-orange-400' : 'text-slate-300'
                }`}>
                  {user.rank === 1 ? <Trophy size={14} /> : user.rank}
                </div>
                <img src={user.avatar} className="w-10 h-10 rounded-xl border border-slate-50" alt="avatar" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h5 className="text-[13px] font-black text-slate-700">{user.name}</h5>
                    <span className="text-[8px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-black">{user.level}</span>
                  </div>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <Zap size={10} className="text-amber-500" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">共创力 {user.points}</span>
                  </div>
                </div>
              </div>
              {user.rank <= 3 && (
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-amber-500">
                  <Star size={14} fill="currentColor" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);


const OrganizationManagementOverlay: React.FC<{
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  onClose: () => void;
  onSwitchOrg: (orgId: string) => void;
}> = ({ user, setUser, onClose, onSwitchOrg }) => {
  type JoinableOrganization = Pick<Organization, 'id' | 'name' | 'members' | 'departments'> & {
    code: string;
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSwitchOrg, setShowSwitchOrg] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempOrgName, setTempOrgName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [matchedJoinOrg, setMatchedJoinOrg] = useState<JoinableOrganization | null>(null);
  const [joinSubmitted, setJoinSubmitted] = useState(false);
  const [copiedOrgCode, setCopiedOrgCode] = useState(false);
  const [showJoinPage, setShowJoinPage] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast('');
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const activeOrg = user.organizations.find(o => o.id === user.activeOrgId) || user.organizations[0];
  const orgCode = '8m5U3X';
  const joinableOrganizations: JoinableOrganization[] = [
    ...user.organizations.map((org, index) => ({
      id: org.id,
      name: org.name,
      code: index === 0 ? orgCode : `ORG${String(index + 1).padStart(3, '0')}`,
      members: org.members,
      departments: org.departments
    })),
    {
      id: 'join_demo_meituan',
      name: '美团外卖',
      code: 'MT2026',
      members: [
        { id: 'jm1', name: '王经理', phone: '13911110001', role: 'OWNER', avatar: 'https://picsum.photos/seed/jm1/100/100' }
      ],
      departments: [{ id: 'jmd1', name: '销售运营部' }]
    },
    {
      id: 'join_demo_byte',
      name: '字节跳动商业化团队',
      code: 'BD2026',
      members: [
        { id: 'jb1', name: '李经理', phone: '13922220001', role: 'OWNER', avatar: 'https://picsum.photos/seed/jb1/100/100' }
      ],
      departments: [{ id: 'jbd1', name: '客户成功部' }]
    }
  ];

  // Sync temp name when active org changes
  useEffect(() => {
    setTempOrgName(activeOrg.name);
  }, [activeOrg.id, activeOrg.name]);

  const isAdmin = activeOrg.role === 'ADMIN';

  const handleCopyOrgCode = () => {
    navigator.clipboard.writeText(orgCode);
    setCopiedOrgCode(true);
    window.setTimeout(() => setCopiedOrgCode(false), 1400);
  };

  const handleUpdateOrgName = () => {
    if (!tempOrgName.trim() || tempOrgName === activeOrg.name) {
      setTempOrgName(activeOrg.name);
      setIsEditingName(false);
      return;
    }
    
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        organizations: prev.organizations.map(org => 
          org.id === activeOrg.id ? { ...org, name: tempOrgName } : org
        )
      };
    });
    setIsEditingName(false);
  };

  const resetJoinFlow = () => {
    setShowJoinPage(false);
    setJoinCode('');
    setMatchedJoinOrg(null);
    setJoinSubmitted(false);
    setToast('');
  };

  const handleCheckJoinCode = () => {
    const normalizedCode = joinCode.trim();
    if (!normalizedCode) {
      setToast('请输入组织编码');
      return;
    }

    const foundOrg = joinableOrganizations.find(org => org.code.toLowerCase() === normalizedCode.toLowerCase());
    if (!foundOrg) {
      setToast('组织编码不存在');
      return;
    }

    setToast('');
    setMatchedJoinOrg(foundOrg);
  };

  const handleSubmitJoinApplication = () => {
    if (!matchedJoinOrg) return;
    setJoinSubmitted(true);
  };

  if (showJoinPage) {
    const canSubmitJoin = joinCode.trim().length > 0;

    return (
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="absolute inset-0 z-[700] flex flex-col overflow-hidden bg-[#F4F4F8] px-6 pt-7"
      >
        <AppToast message={toast} />
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (matchedJoinOrg || joinSubmitted) {
                setMatchedJoinOrg(null);
                setJoinSubmitted(false);
                return;
              }
              resetJoinFlow();
            }}
            className="flex h-10 w-10 items-center justify-center text-slate-900 active:scale-90"
            aria-label="返回"
          >
            <ChevronLeft size={32} strokeWidth={2.2} />
          </button>
          <div className="h-10 w-10" />
        </div>

        {joinSubmitted && matchedJoinOrg ? (
          <>
            <div className="mt-16 flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100/70">
                <Check size={34} strokeWidth={3} />
              </div>
              <h2 className="mt-8 text-[26px] font-semibold leading-tight tracking-tight text-slate-950">
                申请已提交
              </h2>
              <p className="mt-4 max-w-[300px] text-[15px] font-normal leading-7 text-slate-500">
                您已向 {matchedJoinOrg.name} 发起加入申请，管理员确认后即可使用该组织。
              </p>
            </div>

            <div className="mt-auto pb-16">
              <button
                onClick={resetJoinFlow}
                className="mx-auto flex h-[54px] w-[252px] items-center justify-center rounded-full bg-slate-900 text-[17px] font-semibold text-white shadow-xl shadow-slate-200/70 active:scale-95 transition-all"
              >
                完成
              </button>
            </div>
          </>
        ) : matchedJoinOrg ? (
          <>
            <div className="mt-10">
              <h2 className="text-[26px] font-semibold leading-tight tracking-tight text-slate-950">
                申请加入组织
              </h2>
              <p className="mt-4 max-w-[340px] text-[15px] font-normal leading-7 text-slate-500">
                请确认组织信息无误后提交申请。
              </p>
            </div>

            <div className="mt-12 overflow-hidden rounded-[32px] bg-white p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.2)] border border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 shadow-sm shadow-blue-100/70">
                  <Building2 size={28} strokeWidth={2.2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-400">企业名称</p>
                  <h3 className="mt-1 truncate text-[18px] font-semibold text-slate-950">{matchedJoinOrg.name}</h3>
                </div>
              </div>
              <div className="mt-6 rounded-[24px] bg-slate-50 px-5 py-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-400">组织编码</p>
                <p className="mt-2 text-[17px] font-semibold uppercase tracking-[0.18em] text-slate-700">{matchedJoinOrg.code}</p>
              </div>
            </div>

            <div className="mt-auto pb-16">
              <button
                onClick={handleSubmitJoinApplication}
                className="mx-auto flex h-[54px] w-[252px] items-center justify-center rounded-full bg-blue-600 text-[17px] font-semibold text-white shadow-xl shadow-blue-100/70 active:scale-95 transition-all"
              >
                确认申请加入
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mt-8">
              <h2 className="text-[24px] font-semibold leading-tight tracking-tight text-slate-950">
                通过组织编码加入
              </h2>
              <p className="mt-4 max-w-[340px] text-[14px] font-normal leading-7 text-slate-500">
                组织编码是组织的唯一标识，请向管理员或者已经在团队中的成员索要组织编码。
              </p>
              <div className="mt-2 flex justify-end">
                <button className="text-[14px] font-medium text-blue-600 transition-colors hover:text-blue-700">如何获取组织编码?</button>
              </div>
            </div>

            <div className="mt-10">
              <input
                autoFocus
                type="text"
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value);
                  setToast('');
                }}
                placeholder="请输入组织编码"
                className="h-[62px] w-full rounded-[26px] border border-slate-200 bg-white px-6 text-[16px] font-normal uppercase text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="mt-auto pb-16">
              <button
                onClick={handleCheckJoinCode}
                disabled={!canSubmitJoin}
                className={`mx-auto flex h-[54px] w-[252px] items-center justify-center rounded-full text-[17px] font-semibold transition-all ${
                  canSubmitJoin
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-100/70 active:scale-95'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                下一步
              </button>
            </div>
          </>
        )}
      </motion.div>
    );
  }

  const filteredMembers = activeOrg.members?.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.phone.includes(searchQuery)
  ) || [];

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-[600] bg-slate-50 flex flex-col"
    >
      {/* Header */}
      <div className="pt-12 pb-4 px-6 bg-white border-b border-slate-100">
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-800 active:scale-90">
            <ChevronLeft size={28} />
          </button>
          <div className="flex flex-col items-center flex-1 mx-4">
            {isEditingName ? (
              <div className="flex items-center space-x-2 w-full max-w-[200px]">
                <input
                  autoFocus
                  type="text"
                  value={tempOrgName}
                  onChange={(e) => setTempOrgName(e.target.value)}
                  onBlur={handleUpdateOrgName}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateOrgName()}
                  className="text-lg font-black text-slate-900 bg-slate-100 rounded-lg px-2 py-1 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowSwitchOrg(!showSwitchOrg)}
                  className="flex items-center space-x-1 group active:opacity-70 transition-opacity"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{activeOrg.name}</h3>
                  <ChevronDown size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                </button>
                {isAdmin && (
                  <button 
                    onClick={() => setIsEditingName(true)}
                    className="p-1 text-slate-300 hover:text-blue-500 transition-colors"
                  >
                    <Edit3 size={14} />
                  </button>
                )}
              </div>
            )}
            <div className="mt-1 flex items-center space-x-1.5">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{orgCode}</p>
              <button
                type="button"
                onClick={handleCopyOrgCode}
                className="flex h-5 w-5 items-center justify-center rounded-md text-slate-300 active:bg-slate-100 active:text-blue-600"
                aria-label="复制组织编码"
              >
                <Copy size={12} />
              </button>
              {copiedOrgCode && <span className="text-[10px] font-medium text-blue-600">已复制</span>}
            </div>
          </div>
          <button className="w-10 h-10 flex items-center justify-center text-slate-400 active:scale-90">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isAdmin ? (
          <div className="p-6 space-y-8">
            {/* Actions */}
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => setShowInviteModal(true)}
                className="h-[92px] rounded-[26px] bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white shadow-xl shadow-blue-200/70 active:scale-[0.98] transition-all flex items-center justify-between overflow-hidden relative"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />
                <div className="text-left relative z-10">
                  <div className="flex items-center space-x-2">
                    <UserPlus size={17} />
                    <span className="text-[15px] font-medium">邀请新成员</span>
                  </div>
                  <p className="mt-2 max-w-[210px] text-[12px] font-normal leading-4 text-white/72">
                    您是组织管理员，可以邀请同事加入
                  </p>
                </div>
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/18 text-white backdrop-blur">
                  <Building2 size={25} strokeWidth={2.2} />
                </div>
              </button>
              <button 
                onClick={() => setShowJoinPage(true)}
                className="h-[92px] rounded-[26px] bg-white p-5 text-slate-800 shadow-sm border border-slate-100 active:scale-[0.98] transition-all flex items-center justify-between"
              >
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <Plus size={17} strokeWidth={3} className="text-emerald-600" />
                    <span className="text-[15px] font-medium">加入组织</span>
                  </div>
                  <p className="mt-2 max-w-[210px] text-[12px] font-normal leading-4 text-slate-400">
                    组织/团队已经在使用，我要加入
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <BriefcaseBusiness size={25} strokeWidth={2.2} />
                </div>
              </button>
            </div>

            {/* Members List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">组织人员 ({filteredMembers.length})</p>
                <div className="relative w-32">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
                  <input 
                    type="text" 
                    placeholder="搜索..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 pl-7 pr-2 bg-white rounded-xl border border-slate-100 text-[10px] font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>
              <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 divide-y divide-slate-50">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img src={member.avatar} className="w-10 h-10 rounded-xl border border-slate-100" alt={member.name} />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h5 className="text-sm font-black text-slate-800">{member.name}</h5>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold">
                          {member.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-4 text-center">
              <button className="text-red-500 font-black text-[10px] uppercase tracking-[0.2em] active:opacity-60 transition-opacity">
                解散组织
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6 mt-20">
            <div className="w-20 h-20 bg-slate-100 rounded-[32px] flex items-center justify-center text-slate-300">
              <ShieldAlert size={40} />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-semibold text-slate-900">暂无管理权限</h4>
              <p className="text-sm text-slate-400 font-normal leading-relaxed">
                您当前在 {activeOrg.name} 的身份为成员，仅管理员可进行组织管理操作。
              </p>
            </div>
            <button
              onClick={() => setShowJoinPage(true)}
              className="h-14 w-full rounded-[22px] bg-slate-900 text-[18px] font-medium text-white shadow-xl shadow-slate-200 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <Plus size={18} strokeWidth={3} />
              <span>加入其他组织</span>
            </button>
          </div>
        )}
      </div>

      {/* Invite Modal Overlay */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="absolute inset-0 z-[700] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInviteModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full bg-white rounded-[40px] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-[-20px] right-[-20px] text-blue-500/5 rotate-12">
                <UserPlus size={120} strokeWidth={1} />
              </div>
              <div className="relative z-10 text-center space-y-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                  <UserPlus size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900">邀请成员加入</h4>
                  <p className="text-xs text-slate-400 font-bold mt-2">分享邀请链接让成员快速加入组织</p>
                </div>
                <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 text-left">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">组织邀请链接</p>
                  <p className="text-xs text-slate-600 font-bold break-all">
                    {`${window.location.origin}/join?orgId=${activeOrg.id}`}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    const link = `${window.location.origin}/join?orgId=${activeOrg.id}`;
                    navigator.clipboard.writeText(link);
                    alert('邀请链接已复制');
                  }}
                  className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-sm active:scale-95 transition-all"
                >
                  复制邀请链接
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Switch Org Overlay */}
      <AnimatePresence>
        {showSwitchOrg && (
          <div className="absolute inset-0 z-[700] flex flex-col justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSwitchOrg(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative bg-white rounded-t-[40px] p-6 shadow-2xl max-h-[70%]"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
              <h4 className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">切换组织</h4>
              <div className="space-y-2 overflow-y-auto">
                {user.organizations.filter(org => org.role === 'ADMIN').map((org) => (
                  <button 
                    key={org.id}
                    onClick={() => {
                      onSwitchOrg(org.id);
                      setShowSwitchOrg(false);
                    }}
                    className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${
                      user.activeOrgId === org.id ? 'bg-blue-50' : 'active:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        user.activeOrgId === org.id ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <Building2 size={20} />
                      </div>
                      <div className="text-left">
                        <p className={`text-sm font-bold ${user.activeOrgId === org.id ? 'text-blue-600' : 'text-slate-700'}`}>
                          {org.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {org.role === 'ADMIN' ? '管理员' : '成员'}
                        </p>
                      </div>
                    </div>
                    {user.activeOrgId === org.id && <Check size={18} className="text-blue-600" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const InvitationOverlay: React.FC<{
  user: User;
  onClose: () => void;
}> = ({ user, onClose }) => {
  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-[600] bg-slate-50 flex flex-col"
    >
      <div className="pt-12 pb-6 px-6 flex items-center justify-between bg-white border-b border-slate-100">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-800 active:scale-90">
          <ChevronLeft size={28} />
        </button>
        <h3 className="text-lg font-black text-slate-900">分享应用</h3>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10">
        {/* My Code Section - Modern Gradient Card */}
        <div className="relative overflow-hidden bg-white rounded-[40px] p-8 border border-slate-100 shadow-2xl shadow-blue-100/50">
          <div className="absolute top-[-40px] right-[-40px] text-blue-500/5 rotate-12">
            <Share2 size={240} strokeWidth={1} />
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Gift size={12} className="mr-1.5" />
                分享计划
              </div>
              <h4 className="text-xl font-black text-slate-900 leading-tight">分享应用体验<br/>AI 报告新纪元</h4>
            </div>
            
            <div className="w-full space-y-4">
              <div className="bg-slate-50/80 backdrop-blur-sm rounded-3xl p-5 border border-slate-100/50 group transition-all hover:bg-white hover:shadow-md">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2 text-left px-1">您的专属分享链接</p>
                <div className="flex items-center justify-between space-x-3">
                  <p className="text-xs text-slate-600 font-bold truncate flex-1 text-left">
                    {`${window.location.origin}/join?ref=user_${user.phone.slice(-4)}`}
                  </p>
                  <button 
                    onClick={() => {
                      const link = `${window.location.origin}/join?ref=user_${user.phone.slice(-4)}`;
                      navigator.clipboard.writeText(link);
                      alert('分享链接已复制');
                    }}
                    className="p-2.5 bg-white text-blue-600 rounded-xl shadow-sm border border-slate-100 active:scale-90 transition-all"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <button 
                onClick={() => {
                  const link = `${window.location.origin}/join?ref=user_${user.phone.slice(-4)}`;
                  if (navigator.share) {
                    navigator.share({
                      title: '小狸报告分享',
                      text: '快来和我一起使用小狸报告，体验 AI 驱动的访谈报告新体验！',
                      url: link,
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(link);
                    alert('分享链接已复制');
                  }
                }}
                className="w-full h-16 bg-blue-600 text-white rounded-[24px] font-black text-sm flex items-center justify-center space-x-3 active:scale-95 transition-all shadow-xl shadow-blue-600/30"
              >
                <Share2 size={20} />
                <span>立即分享给好友</span>
              </button>
            </div>
          </div>
        </div>


        {/* Invited Users Section - Refined List */}
        {user.invitedUsers && user.invitedUsers.length > 0 && (
          <div className="space-y-5 pb-10">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-2">
                <Users size={14} className="text-blue-500" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">已成功邀请的好友</p>
              </div>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black">{user.invitedUsers.length}</span>
            </div>
            
            <div className="space-y-3">
              {user.invitedUsers.map((invitedUser) => (
                <div key={invitedUser.id} className="bg-white rounded-3xl p-4 flex items-center justify-between border border-slate-100 transition-all active:scale-[0.98]">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img src={invitedUser.avatar} className="w-12 h-12 rounded-2xl border-2 border-slate-50 object-cover" alt="avatar" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Check size={10} className="text-white" strokeWidth={4} />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-[14px] font-black text-slate-800">{invitedUser.name}</h5>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-[9px] text-slate-400 font-bold">加入时间: {invitedUser.joinDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400">
                    已关联
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onSwitchOrg, setUser, intent, onClearIntent, onOverlayChange }) => {
  const phone = user.phone;
  const [userName, setUserName] = useState('官方销售顾问');
  const [userAvatar, setUserAvatar] = useState('https://picsum.photos/seed/profile/200/200');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showCoCreation, setShowCoCreation] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const [showOrgManagement, setShowOrgManagement] = useState(false);

  React.useEffect(() => {
    if (intent === 'org_management') {
      setShowOrgManagement(true);
      onClearIntent?.();
    }
  }, [intent]);

  const hasFullscreenOverlay =
    showEditProfile ||
    showCoCreation ||
    showHelp ||
    showSettings ||
    showInvitation ||
    showOrgManagement;

  React.useEffect(() => {
    onOverlayChange?.(hasFullscreenOverlay);
    return () => onOverlayChange?.(false);
  }, [hasFullscreenOverlay, onOverlayChange]);

  // 用户当前等级数据
  const userLevel = {
    current: 3,
    title: '核心共创官',
    points: 1240,
    nextThreshold: 2000,
    color: 'from-indigo-500 via-purple-500 to-pink-500'
  };

  // 小狸共创官排行榜数据
  const rankingData = [
    { rank: 1, name: '林深时见鹿', points: 2840, avatar: 'https://picsum.photos/seed/u1/100/100', level: '至尊' },
    { rank: 2, name: '晴空万里', points: 2610, avatar: 'https://picsum.photos/seed/u2/100/100', level: '荣耀' },
    { rank: 3, name: '报告专家A', points: 2450, avatar: 'https://picsum.photos/seed/u3/100/100', level: '荣耀' },
    { rank: 4, name: '陈经理', points: 1980, avatar: 'https://picsum.photos/seed/u4/100/100', level: '核心' },
    { rank: 5, name: '奋斗中的销售', points: 1560, avatar: 'https://picsum.photos/seed/u5/100/100', level: '核心' },
  ];



  return (
    <div className="h-full relative overflow-hidden bg-slate-50">
      <div className="h-full overflow-y-auto flex flex-col space-y-8 pt-12 px-6 pb-32">
        {/* 用户头部信息 */}
        <div className="flex flex-col items-center animate-fade-in group">
          <div className="relative">
            <img src={userAvatar} className="w-24 h-24 rounded-[32px] border-4 border-white shadow-lg relative z-10 object-cover" alt="avatar" />
            <div className="absolute -bottom-1 -right-1 bg-yellow-400 p-1.5 rounded-xl border-4 border-white z-20">
              <Award size={16} className="text-white" />
            </div>
          </div>
          
          <button 
            onClick={() => setShowEditProfile(true)}
            className="mt-6 flex items-center space-x-1 active:opacity-70 transition-opacity"
          >
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{userName}</h3>
            <ChevronRight size={20} className="text-slate-300" />
          </button>

          {/* 小狸共创官等级铭牌 - 重构为带有分等级视觉的效果 */}
          <button 
            onClick={() => setShowCoCreation(true)}
            className="mt-3 px-5 py-1.5 bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-950 border border-white/10 rounded-full flex items-center space-x-2 shadow-xl shadow-purple-900/10 active:scale-95 transition-all"
          >
            <div className="w-4 h-4 bg-white/20 rounded flex items-center justify-center">
              <Crown size={10} className="text-amber-400" fill="currentColor" />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">LV.{userLevel.current} {userLevel.title}</span>
            </div>
            <ChevronRight size={12} className="text-white/30" />
          </button>
        </div>

        {/* 功能模块列表 */}
        <div className="space-y-4">
          <p className="px-5 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">服务与支持</p>
          <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-50 divide-y divide-slate-50">
            {[
              { 
                id: 'cocreation',
                icon: <Zap size={20} />, 
                iconBg: 'bg-amber-50 text-amber-500', 
                label: '小狸共创官',
                tag: 'LV.3',
                action: () => setShowCoCreation(true)
              },
              { 
                id: 'org_management',
                icon: <Building2 size={20} />, 
                iconBg: 'bg-indigo-50 text-indigo-500', 
                label: '组织管理',
                action: () => setShowOrgManagement(true)
              },
              { 
                id: 'help',
                icon: <HelpCircle size={20} />, 
                iconBg: 'bg-blue-50 text-blue-500', 
                label: '帮助与反馈',
                action: () => setShowHelp(true)
              },
              { 
                id: 'settings',
                icon: <Settings size={20} />, 
                iconBg: 'bg-slate-50 text-slate-500', 
                label: '通用设置',
                action: () => setShowSettings(true)
              },
              { 
                id: 'share',
                icon: <Gift size={20} />, 
                iconBg: 'bg-indigo-50 text-indigo-500', 
                label: '分享应用',
                action: () => setShowInvitation(true)
              }
            ].map((item, i) => (
              <button 
                key={item.id} 
                onClick={item.action}
                className="w-full px-7 py-5 flex items-center justify-between active:bg-slate-50 transition-all group"
              >
                <div className="flex items-center space-x-5">
                  <div className={`w-10 h-10 ${item.iconBg} rounded-xl flex items-center justify-center`}>
                    {item.icon}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[14px] font-bold text-slate-700">{item.label}</span>
                    {item.tag && (
                      <span className="px-1.5 py-0.5 bg-slate-900 text-white text-[8px] font-black rounded-md">
                        {item.tag}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-200 group-active:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        {/* 退出登录按钮 */}
        <button 
          onClick={onLogout}
          className="w-full py-5 bg-red-50 text-red-500 rounded-[28px] font-black text-sm flex items-center justify-center space-x-2 active:scale-95 transition-all shadow-sm border border-red-100/50"
        >
          <LogOut size={18} />
          <span>退出登录</span>
        </button>
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {showEditProfile && (
          <EditProfileOverlay 
            userName={userName}
            userAvatar={userAvatar}
            onClose={() => setShowEditProfile(false)}
            onSave={(name, avatar) => {
              setUserName(name);
              setUserAvatar(avatar);
              setShowEditProfile(false);
            }}
          />
        )}

        {showCoCreation && (
          <CoCreationOverlay 
            userLevel={userLevel}
            rankingData={rankingData}
            onClose={() => setShowCoCreation(false)}
          />
        )}

        {showHelp && <HelpFeedback onBack={() => setShowHelp(false)} />}
        {showSettings && <GeneralSettings onBack={() => setShowSettings(false)} />}

        {showInvitation && (
          <InvitationOverlay 
            user={user}
            onClose={() => setShowInvitation(false)}
          />
        )}

        {showOrgManagement && (
          <OrganizationManagementOverlay 
            user={user}
            setUser={setUser}
            onClose={() => setShowOrgManagement(false)}
            onSwitchOrg={onSwitchOrg}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default Profile;
