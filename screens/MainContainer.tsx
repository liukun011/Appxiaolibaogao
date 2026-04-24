import React, { useRef, useState } from 'react';
import { Tab, InterviewRecord, User } from '../types';
import { Home as HomeIcon, User as UserIcon, Plus, FileText, Layers } from 'lucide-react';
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
  { id: '1', clientName: '李总', company: '百度(中国)', status: 'SIGNED', time: '1小时前', summary: '对二期方案非常满意，已完成电子签。后续需跟进部署及技术培训事宜。', archived: false, reportStatus: 'GENERATED', orgId: 'org_1' },
  { id: '2', clientName: '王经理', company: '美团外卖', status: 'FOLLOWING', time: '4小时前', summary: '价格敏感度较高，正在内部申请折扣权限，预计周五前给予初步反馈。', archived: false, reportStatus: 'NONE', orgId: 'org_1' },
  { id: '3', clientName: '张经理', company: '腾讯科技', status: 'FOLLOWING', time: '2天前', summary: '初步接触，客户对数字化转型有浓厚兴趣，需准备详细案例。', archived: false, reportStatus: 'GENERATED', orgId: 'org_1' },
  { id: '4', clientName: '陈总', company: '阿里巴巴', status: 'FOLLOWING', time: '3天前', summary: '探讨了云服务迁移方案任务。', archived: false, reportStatus: 'NONE', orgId: 'org_2' },
  { id: '5', clientName: '赵主管', company: '字节跳动', status: 'SIGNED', time: '4天前', summary: '短视频营销合作达成意向。', archived: false, reportStatus: 'GENERATED', orgId: 'org_2' },
  { id: '11', clientName: '赵总', company: '小米集团', status: 'SIGNED', time: '3天前', summary: '三期合同已落位，目前正在进行资源对齐，进展顺利。', archived: true, reportStatus: 'GENERATED', orgId: 'org_1' },
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
  
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);
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
  };

  const navigateToTab = (tab: Tab, intent?: 'templates' | 'questionnaire' | 'org_management') => {
    setActiveTab(tab);
    setSelectedInterviewId(null);
    setProfileIntent(intent || null);
  };

  const handleArchive = (id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, archived: true } : r));
    setSelectedInterviewId(null);
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
      status: payload.startImmediately ? 'FOLLOWING' : 'PENDING',
      time: '刚刚',
      summary: '访谈已创建。',
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
    setSelectedInterviewId(recordId);

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
        setSelectedInterviewId(record.id);
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
          onBack={() => setSelectedInterviewId(null)} 
          onArchive={() => handleArchive(selectedInterview.id)} 
          onUpdateEnterpriseInfo={handleUpdateInterviewEnterprise}
          onFetchCompanyInsights={handleFetchCompanyInsights}
          onGenerateChecklist={handleGenerateChecklist}
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
            setUser={setUser}
            onSwitchOrg={handleSwitchOrg}
            onNavigate={navigateToTab} 
            records={filteredRecords}
            onSelectRecord={(record) => setSelectedInterviewId(record.id)}
            onOpenNotifications={() => setShowNotifications(true)}
          />
        );
      case Tab.REPORTS:
        return <Reports records={filteredRecords} onSelectRecord={(record) => setSelectedInterviewId(record.id)} />;
      case Tab.NEW_INTERVIEW: 
        return <NewInterview onCreateInterview={handleCreateInterview} />;
      case Tab.MANAGEMENT:
        return <Management />;
      case Tab.PROFILE: 
        return <Profile user={user} onLogout={onLogout} onSwitchOrg={handleSwitchOrg} setUser={setUser} intent={profileIntent} onClearIntent={() => setProfileIntent(null)} />;
      default: 
        return <Home phone={phone} onNavigate={navigateToTab} records={records} onSelectRecord={(record) => setSelectedInterviewId(record.id)} onOpenNotifications={() => setShowNotifications(true)} />;
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

      {!selectedInterview && !showNotifications && (
        <div className="bg-white/95 backdrop-blur-md border-t border-slate-100 px-2 py-4 flex justify-between items-center z-[100] h-24 animate-[slideUpNav_0.3s_ease-out]">
          <NavItem tab={Tab.HOME} icon={HomeIcon} label="首页" />
          <NavItem tab={Tab.REPORTS} icon={FileText} label="报告" />

          <div className="relative -top-6 flex-1 flex justify-center">
            <button 
              onClick={() => navigateToTab(Tab.NEW_INTERVIEW)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                activeTab === Tab.NEW_INTERVIEW 
                  ? 'bg-blue-600 scale-110 shadow-blue-200' 
                  : 'bg-slate-800 shadow-slate-200'
              }`}
            >
              <Plus size={28} className="text-white" strokeWidth={3} />
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
