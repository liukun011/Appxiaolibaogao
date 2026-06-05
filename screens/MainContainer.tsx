import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Tab, InterviewRecord, User } from '../types';
import { Home as HomeIcon, User as UserIcon, Plus, FileText, Layers, Building2, Check } from 'lucide-react';
import Home from './Home';
import NewInterview, { CreateInterviewPayload } from './NewInterview';
import Profile from './Profile';
import Reports from './Reports';
import Management from './Management';
import InterviewDetail from './InterviewDetail';
import Notifications, { Notification } from './Notifications';
import {
  buildAiChecklistSections,
  buildCompanyInsightItems,
  buildTemplatePresetSections,
  mergeChecklistSections,
  presetChecklistTemplates,
  replacePresetChecklistSections
} from '../utils/interviewChecklist';

interface MainContainerProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  onLogout: () => void;
}

const defaultPresetTemplate = presetChecklistTemplates[0];

const initialRecords: (InterviewRecord & { archived: boolean })[] = [
  { id: '1', interviewName: '百度二期部署报告项目', clientName: '李总', company: '百度(中国)', creatorName: '张三', createdAt: '2026-06-05 09:30:00', status: 'SIGNED', time: '1小时前', summary: '对二期方案非常满意，已完成电子签。后续需跟进部署及技术培训事宜。', archived: false, reportStatus: 'GENERATED', orgId: 'org_1' },
  { id: '2', interviewName: '美团外卖折扣审批项目', clientName: '王经理', company: '美团外卖', creatorName: '李四', createdAt: '2026-06-05 06:20:00', status: 'FOLLOWING', time: '4小时前', summary: '价格敏感度较高，正在内部申请折扣权限，预计周五前给予初步反馈。', archived: false, reportStatus: 'GENERATING', orgId: 'org_1' },
  { id: '3', interviewName: '腾讯数字化转型项目', clientName: '张经理', company: '腾讯科技', creatorName: '王五', createdAt: '2026-06-03 14:10:00', status: 'FOLLOWING', time: '2天前', summary: '初步接触，客户对数字化转型有浓厚兴趣，需准备详细案例。', archived: false, reportStatus: 'GENERATED', orgId: 'org_1' },
  { id: '4', interviewName: '阿里云服务迁移项目', clientName: '陈总', company: '阿里巴巴', creatorName: '陈经理', createdAt: '2026-06-02 11:00:00', status: 'FOLLOWING', time: '3天前', summary: '探讨了云服务迁移方案任务。', archived: false, reportStatus: 'NONE', orgId: 'org_2' },
  { id: '5', interviewName: '字节短视频营销项目', clientName: '赵主管', company: '字节跳动', creatorName: '小王', createdAt: '2026-06-01 16:45:00', status: 'SIGNED', time: '4天前', summary: '短视频营销合作达成意向。', archived: false, reportStatus: 'GENERATED', orgId: 'org_2' },
  { id: '11', interviewName: '小米三期合同项目', clientName: '赵总', company: '小米集团', creatorName: '张三', createdAt: '2026-06-02 18:30:00', status: 'SIGNED', time: '3天前', summary: '三期合同已落位，目前正在进行资源对齐，进展顺利。', archived: true, reportStatus: 'GENERATED', orgId: 'org_1' },
];

const withDefaultChecklist = (record: InterviewRecord & { archived: boolean }): InterviewRecord & { archived: boolean } => {
  const templateId = record.templateId ?? defaultPresetTemplate.id;
  const templateTitle = record.templateTitle ?? defaultPresetTemplate.title;

  return {
    ...record,
    templateId,
    templateTitle,
    uploadedAssets: record.uploadedAssets ?? [],
    companyInsightStatus: record.companyInsightStatus ?? 'IDLE',
    questionChecklistStatus: record.questionChecklistStatus ?? 'IDLE',
    companyInsightItems: record.companyInsightItems ?? [],
    questionChecklistSections:
      record.questionChecklistSections && record.questionChecklistSections.length > 0
        ? record.questionChecklistSections
        : buildTemplatePresetSections(templateId, templateTitle)
  };
};

const MainContainer: React.FC<MainContainerProps> = ({ user, setUser, onLogout }) => {
  const phone = user.phone;
  const activeOrg = user.organizations.find(o => o.id === user.activeOrgId) || user.organizations[0];
  
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [profileIntent, setProfileIntent] = useState<'templates' | 'questionnaire' | 'org_management' | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOrgSwitcher, setShowOrgSwitcher] = useState(false);
  const [showProfileOverlay, setShowProfileOverlay] = useState(false);
  const [showNewInterviewDrawer, setShowNewInterviewDrawer] = useState(false);
  
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);
  const [selectedDetailView, setSelectedDetailView] = useState<'overview' | 'checklist' | 'insights' | 'recording'>('overview');
  const checklistGenerationTimers = useRef<Record<string, number>>({});
  const companyInsightTimers = useRef<Record<string, number>>({});
  
  const [records, setRecords] = useState<(InterviewRecord & { archived: boolean })[]>(
    initialRecords.map(withDefaultChecklist)
  );

  const filteredRecords = records.filter(r => r.orgId === user.activeOrgId);
  const selectedInterview = selectedInterviewId
    ? records.find((record) => record.id === selectedInterviewId) ?? null
    : null;

  const handleSwitchOrg = (orgId: string) => {
    setUser(prev => prev ? { ...prev, activeOrgId: orgId } : null);
    setShowOrgSwitcher(false);
  };

  const navigateToTab = (tab: Tab, intent?: 'templates' | 'questionnaire' | 'org_management') => {
    setActiveTab(tab);
    setSelectedInterviewId(null);
    setSelectedDetailView('overview');
    setProfileIntent(intent || null);
    setShowOrgSwitcher(false);
    setShowProfileOverlay(false);
    setShowNewInterviewDrawer(false);
  };

  const handleArchive = (id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, archived: true } : r));
    setSelectedInterviewId(null);
    setSelectedDetailView('overview');
  };

  const openRecordDetail = (
    record: InterviewRecord,
    initialView: 'overview' | 'checklist' | 'insights' | 'recording' = 'overview'
  ) => {
    setSelectedDetailView(initialView);
    setSelectedInterviewId(record.id);
  };

  const scheduleCompanyInsightFetch = (
    recordId: string,
    companyName: string,
    companyCode: string,
    uploadedAssets = [] as NonNullable<InterviewRecord['uploadedAssets']>
  ) => {
    const existingTimer = companyInsightTimers.current[recordId];
    if (existingTimer) {
      window.clearTimeout(existingTimer);
    }

    setRecords((prev) =>
      prev.map((record) =>
        record.id === recordId
          ? {
              ...record,
              companyInsightStatus: 'FETCHING'
            }
          : record
      )
    );

    companyInsightTimers.current[recordId] = window.setTimeout(() => {
      setRecords((prev) =>
        prev.map((record) =>
          record.id === recordId
            ? {
                ...record,
                companyInsightStatus: 'READY',
                companyInsightItems: buildCompanyInsightItems(companyName, companyCode, uploadedAssets)
              }
            : record
        )
      );
      delete companyInsightTimers.current[recordId];
    }, 2600);
  };

  const scheduleChecklistGeneration = (
    recordId: string,
    companyName: string,
    companyCode: string,
    uploadedAssets = [] as NonNullable<InterviewRecord['uploadedAssets']>
  ) => {
    const existingTimer = checklistGenerationTimers.current[recordId];
    if (existingTimer) {
      window.clearTimeout(existingTimer);
    }

    setRecords((prev) =>
      prev.map((record) =>
        record.id === recordId
          ? {
              ...record,
              summary: '问题清单生成中。',
              questionChecklistStatus: 'GENERATING'
            }
          : record
      )
    );

    checklistGenerationTimers.current[recordId] = window.setTimeout(() => {
      setRecords((prev) =>
        prev.map((record) =>
          record.id === recordId
            ? {
                ...record,
                summary: '问题清单已生成，可直接进入查看。',
                questionChecklistStatus: 'READY',
                questionChecklistSections: mergeChecklistSections(
                  record.questionChecklistSections ?? [],
                  buildAiChecklistSections(companyName, companyCode, uploadedAssets)
                )
              }
            : record
        )
      );
      delete checklistGenerationTimers.current[recordId];
    }, 2600);
  };

  const handleCreateInterview = (payload: CreateInterviewPayload) => {
    const normalizedCompanyName = payload.companyName.trim();
    const normalizedCompanyCode = payload.companyCode.trim();
    const displayCompany = normalizedCompanyName || normalizedCompanyCode || payload.interviewName;
    const presetSections = buildTemplatePresetSections(payload.templateId, payload.templateTitle);
    const recordId = `record_${Date.now()}`;

    const newRecord: InterviewRecord & { archived: boolean } = {
      id: recordId,
      interviewName: payload.interviewName,
      clientName: normalizedCompanyName || normalizedCompanyCode ? '企业信息已补充' : '企业信息待补充',
      company: displayCompany,
      companyCode: normalizedCompanyCode,
      creatorName: '我',
      createdAt: new Date().toLocaleString('sv-SE', { hour12: false }),
      status: payload.startImmediately ? 'FOLLOWING' : 'PENDING',
      time: '刚刚',
      summary: payload.description.trim() || '报告项目已创建。',
      archived: false,
      reportStatus: 'NONE',
      orgId: user.activeOrgId,
      templateId: payload.templateId,
      templateTitle: payload.templateTitle,
      uploadedAssets: payload.uploadedAssets,
      companyInsightStatus: 'IDLE',
      questionChecklistStatus: 'IDLE',
      companyInsightItems: [],
      questionChecklistSections: presetSections
    };

    setRecords((prev) => [newRecord, ...prev]);
    setActiveTab(Tab.HOME);
    setShowNewInterviewDrawer(false);
    setSelectedDetailView('overview');
    setSelectedInterviewId(payload.startImmediately ? null : recordId);

    if (normalizedCompanyName || normalizedCompanyCode) {
      scheduleCompanyInsightFetch(recordId, normalizedCompanyName, normalizedCompanyCode, payload.uploadedAssets);
    }
  };

  const handleUpdateInterviewEnterprise = (recordId: string, companyName: string, companyCode: string) => {
    const normalizedCompanyName = companyName.trim();
    const normalizedCompanyCode = companyCode.trim();
    let uploadedAssets: NonNullable<InterviewRecord['uploadedAssets']> = [];

    setRecords((prev) =>
      prev.map((record) => {
        if (record.id !== recordId) return record;
        uploadedAssets = record.uploadedAssets ?? [];

        return {
          ...record,
          company: normalizedCompanyName || record.interviewName || record.company,
          clientName: normalizedCompanyName ? '企业信息已补充' : record.clientName,
          companyCode: normalizedCompanyCode,
          companyInsightStatus:
            normalizedCompanyName || normalizedCompanyCode ? 'IDLE' : record.companyInsightStatus,
          companyInsightItems:
            normalizedCompanyName || normalizedCompanyCode ? [] : record.companyInsightItems,
          questionChecklistStatus:
            normalizedCompanyName || normalizedCompanyCode ? 'IDLE' : record.questionChecklistStatus,
          summary:
            normalizedCompanyName || normalizedCompanyCode
              ? '企业信息已更新。'
              : record.summary
        };
      })
    );

    if (normalizedCompanyName || normalizedCompanyCode) {
      scheduleCompanyInsightFetch(recordId, normalizedCompanyName, normalizedCompanyCode, uploadedAssets);
    }
  };

  const handleFetchCompanyInsights = (recordId: string) => {
    const targetRecord = records.find((record) => record.id === recordId);
    if (!targetRecord) return;

    const companyName =
      targetRecord.interviewName && targetRecord.company === targetRecord.interviewName
        ? ''
        : targetRecord.company;
    const companyCode = targetRecord.companyCode ?? '';
    const uploadedAssets = targetRecord.uploadedAssets ?? [];

    if (!companyName.trim() && !companyCode.trim()) {
      return;
    }

    scheduleCompanyInsightFetch(recordId, companyName, companyCode, uploadedAssets);
  };

  const handleGenerateChecklist = (recordId: string) => {
    const targetRecord = records.find((record) => record.id === recordId);
    if (!targetRecord) return;

    const companyName =
      targetRecord.interviewName && targetRecord.company === targetRecord.interviewName
        ? ''
        : targetRecord.company;
    const companyCode = targetRecord.companyCode ?? '';
    const uploadedAssets = targetRecord.uploadedAssets ?? [];

    if (!companyName.trim() && !companyCode.trim() && uploadedAssets.length === 0) {
      return;
    }

    scheduleChecklistGeneration(recordId, companyName, companyCode, uploadedAssets);
  };

  const handleReportStatusChange = (recordId: string, reportStatus: NonNullable<InterviewRecord['reportStatus']>) => {
    setRecords((prev) =>
      prev.map((record) => (record.id === recordId ? { ...record, reportStatus } : record))
    );
  };

  const handleToggleChecklistQuestion = (recordId: string, questionId: string) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.id !== recordId
          ? record
          : {
              ...record,
              questionChecklistSections: (record.questionChecklistSections ?? []).map((section) => ({
                ...section,
                questions: section.questions.map((question) =>
                  question.id === questionId ? { ...question, selected: !question.selected } : question
                )
              }))
            }
      )
    );
  };

  const handleSwitchChecklistTemplate = (recordId: string, templateId: string, templateTitle: string) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.id !== recordId
          ? record
          : {
              ...record,
              templateId,
              templateTitle,
              questionChecklistSections: replacePresetChecklistSections(
                record.questionChecklistSections ?? [],
                templateId,
                templateTitle
              )
            }
      )
    );
  };

  const handleNotificationClick = (notif: Notification) => {
    setShowNotifications(false);
    if (notif.relatedId) {
      const record = records.find(r => r.id === notif.relatedId);
      if (record) {
        openRecordDetail(record);
        return;
      }
    }
    navigateToTab(Tab.HOME);
  };

  const renderContent = () => {
    if (selectedInterview) {
      return (
        <InterviewDetail 
          record={selectedInterview} 
          initialView={selectedDetailView}
          onBack={() => {
            setSelectedInterviewId(null);
            setSelectedDetailView('overview');
          }} 
          onArchive={() => handleArchive(selectedInterview.id)} 
          onUpdateEnterpriseInfo={handleUpdateInterviewEnterprise}
          onFetchCompanyInsights={handleFetchCompanyInsights}
          onGenerateChecklist={handleGenerateChecklist}
          onReportStatusChange={handleReportStatusChange}
          onToggleChecklistQuestion={handleToggleChecklistQuestion}
          onSwitchChecklistTemplate={handleSwitchChecklistTemplate}
        />
      );
    }

    switch (activeTab) {
      case Tab.HOME: 
        return (
          <Home 
            user={user}
            onSwitchOrg={handleSwitchOrg}
            onNavigate={navigateToTab} 
            records={filteredRecords}
            onSelectRecord={(record) => openRecordDetail(record)}
            onOpenRecording={(record) => openRecordDetail(record, 'recording')}
            onOpenNotifications={() => setShowNotifications(true)}
            onOpenOrgSwitcher={() => setShowOrgSwitcher(true)}
          />
        );
      case Tab.REPORTS:
        return <Reports records={filteredRecords} onSelectRecord={(record) => openRecordDetail(record)} />;
      case Tab.NEW_INTERVIEW: 
        return <NewInterview onCreateInterview={handleCreateInterview} onCancel={() => navigateToTab(Tab.HOME)} />;
      case Tab.MANAGEMENT:
        return <Management />;
      case Tab.PROFILE: 
        return <Profile user={user} onLogout={onLogout} onSwitchOrg={handleSwitchOrg} setUser={setUser} intent={profileIntent} onClearIntent={() => setProfileIntent(null)} onOverlayChange={setShowProfileOverlay} />;
      default: 
        return <Home user={user} onSwitchOrg={handleSwitchOrg} onNavigate={navigateToTab} records={records} onSelectRecord={(record) => openRecordDetail(record)} onOpenRecording={(record) => openRecordDetail(record, 'recording')} onOpenNotifications={() => setShowNotifications(true)} onOpenOrgSwitcher={() => setShowOrgSwitcher(true)} />;
    }
  };

  const NavItem = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => (
    <button 
      onClick={() => navigateToTab(tab)}
      className={`flex flex-col items-center space-y-1 transition-all flex-1 ${
        activeTab === tab ? 'text-blue-600' : 'text-slate-300'
      }`}
    >
      <Icon size={22} strokeWidth={activeTab === tab ? 2.5 : 2} />
      <span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
    </button>
  );

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-slate-50">
      <div className="flex-1 relative overflow-hidden">
        {renderContent()}
      </div>

      {showNotifications && (
        <Notifications 
          onClose={() => setShowNotifications(false)} 
          onNotificationClick={handleNotificationClick}
        />
      )}

      {showOrgSwitcher && (
        <div className="absolute inset-0 z-[700] animate-fade-in">
          <div
            className="absolute inset-0 bg-slate-950/38 backdrop-blur-sm"
            onClick={() => setShowOrgSwitcher(false)}
          />
          <div className="absolute left-5 right-5 top-20 overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_24px_54px_rgba(15,23,42,0.24)] animate-slide-up">
            <div className="border-b border-slate-100 px-5 py-4">
              <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">切换组织</h4>
              <p className="mt-1 text-[11px] font-medium text-slate-400">选择后将切换当前工作空间</p>
            </div>
            <div className="max-h-[360px] overflow-y-auto p-2.5">
              {user.organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => handleSwitchOrg(org.id)}
                  className={`w-full rounded-2xl p-3.5 flex items-center justify-between transition-all ${
                    user.activeOrgId === org.id ? 'bg-blue-50' : 'active:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        user.activeOrgId === org.id
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <Building2 size={20} />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-bold ${user.activeOrgId === org.id ? 'text-blue-600' : 'text-slate-700'}`}>
                        {org.name}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {org.role === 'ADMIN' ? '管理员' : '成员'}
                      </p>
                    </div>
                  </div>
                  {user.activeOrgId === org.id && <Check size={18} className="text-blue-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showNewInterviewDrawer && (
          <div className="absolute inset-0 z-[760] flex flex-col justify-end">
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewInterviewDrawer(false)}
              className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]"
              aria-label="关闭新建报告项目"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="relative h-[82%] overflow-hidden rounded-t-[32px] bg-[#F7F8FC] shadow-[0_-24px_70px_rgba(15,23,42,0.24)]"
            >
              <NewInterview
                onCreateInterview={handleCreateInterview}
                onCancel={() => setShowNewInterviewDrawer(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {!selectedInterview && activeTab !== Tab.NEW_INTERVIEW && !showNotifications && !showOrgSwitcher && !showProfileOverlay && !showNewInterviewDrawer && (
        <div className="bg-white/95 backdrop-blur-md border-t border-slate-100 px-2 py-4 flex justify-between items-center z-[100] h-24 animate-[slideUpNav_0.3s_ease-out]">
          <NavItem tab={Tab.HOME} icon={HomeIcon} label="首页" />
          <NavItem tab={Tab.REPORTS} icon={FileText} label="报告" />

          <div className="relative -top-6 flex-1 flex justify-center">
            <button 
              onClick={() => setShowNewInterviewDrawer(true)}
              className={`w-16 h-16 rounded-full flex items-center justify-center border-[6px] border-white bg-[#4A3CFA] text-white transition-all duration-300 shadow-[0_18px_32px_-12px_rgba(74,60,250,0.72)] ${
                activeTab === Tab.NEW_INTERVIEW 
                  ? 'scale-110' 
                  : 'active:scale-95'
              }`}
            >
              <Plus size={34} strokeWidth={3} />
            </button>
          </div>

          <NavItem tab={Tab.MANAGEMENT} icon={Layers} label="管理" />
          <NavItem tab={Tab.PROFILE} icon={UserIcon} label="我的" />
        </div>
      )}

      <style>{`
        @keyframes slideUpNav { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default MainContainer;
