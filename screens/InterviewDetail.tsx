import React, { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  CheckCircle2,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  Eye,
  FileText,
  ListChecks,
  Loader2,
  Mic,
  Plus,
  Sparkles,
  X
} from 'lucide-react';
import {
  InterviewChecklistQuestion,
  InterviewInsightItem,
  InterviewRecord,
  UploadedAsset,
  UploadedAssetKind
} from '../types';
import { presetChecklistTemplates } from '../utils/interviewChecklist';

interface InterviewDetailProps {
  record: InterviewRecord;
  initialView?: 'overview' | 'checklist' | 'insights' | 'recording';
  onBack: () => void;
  onArchive: () => void;
  onUpdateEnterpriseInfo: (recordId: string, companyName: string, companyCode: string) => void;
  onFetchCompanyInsights: (recordId: string) => void;
  onGenerateChecklist: (recordId: string) => void;
  onReportStatusChange: (recordId: string, reportStatus: NonNullable<InterviewRecord['reportStatus']>) => void;
  onToggleChecklistQuestion: (recordId: string, questionId: string) => void;
  onSwitchChecklistTemplate: (recordId: string, templateId: string, templateTitle: string) => void;
}

type QuestionFilter = 'all' | 'pending' | 'selected';
type DetailView = 'overview' | 'checklist' | 'insights' | 'recording';

const SUMMARY_PREVIEW_LENGTH = 54;
const INSIGHT_PREVIEW_COUNT = 4;

const getAssetTheme = (kind: UploadedAssetKind) => {
  if (kind === 'excel') return 'bg-emerald-50 text-emerald-500';
  if (kind === 'word') return 'bg-blue-50 text-blue-500';
  if (kind === 'audio') return 'bg-violet-50 text-violet-500';
  return 'bg-amber-50 text-amber-500';
};

const getAssetLabel = (kind: UploadedAssetKind) => {
  if (kind === 'excel') return 'E';
  if (kind === 'word') return 'W';
  if (kind === 'audio') return 'M';
  return 'P';
};

const getInsightTone = (tone?: InterviewInsightItem['tone']) => {
  if (tone === 'attention') return 'bg-amber-50 text-amber-600';
  if (tone === 'positive') return 'bg-emerald-50 text-emerald-600';
  return 'bg-slate-100 text-slate-500';
};

const parseEnterpriseInput = (value: string) => {
  const normalized = value.trim().toUpperCase();
  const isCode = /^[0-9A-Z]{18}$/.test(normalized);

  return {
    companyName: isCode ? '' : normalized,
    companyCode: isCode ? normalized : ''
  };
};

const AssetRow: React.FC<{ asset: UploadedAsset }> = ({ asset }) => (
  <div className="flex items-center gap-3 rounded-[22px] border border-slate-100 bg-white px-4 py-4">
    <div
      className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black ${getAssetTheme(asset.kind)}`}
    >
      {getAssetLabel(asset.kind)}
    </div>
    <p className="min-w-0 flex-1 truncate text-[14px] font-black text-slate-700">{asset.name}</p>
  </div>
);

const InterviewDetail: React.FC<InterviewDetailProps> = ({
  record,
  initialView = 'overview',
  onBack,
  onArchive,
  onUpdateEnterpriseInfo,
  onFetchCompanyInsights,
  onGenerateChecklist,
  onReportStatusChange,
  onToggleChecklistQuestion,
  onSwitchChecklistTemplate
}) => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(record.reportStatus === 'GENERATING');
  const [hasGeneratedReport, setHasGeneratedReport] = useState(record.reportStatus === 'GENERATED');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [showMetaModal, setShowMetaModal] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [detailView, setDetailView] = useState<DetailView>(initialView);
  const [enterpriseInput, setEnterpriseInput] = useState('');
  const [questionFilter, setQuestionFilter] = useState<QuestionFilter>('all');

  const editableCompanyName = useMemo(() => {
    if (record.interviewName && record.company === record.interviewName) {
      return '';
    }

    return record.company;
  }, [record.company, record.interviewName]);

  const uploadedAssets = record.uploadedAssets ?? [];
  const recordingAssets = uploadedAssets.filter((asset) => asset.kind === 'audio');
  const hasCompanyInput = Boolean(editableCompanyName.trim() || (record.companyCode ?? '').trim());
  const canRunChecklist = hasCompanyInput || uploadedAssets.length > 0;
  const hasInsightItems = (record.companyInsightItems ?? []).length > 0;
  const previewInsightItems = useMemo(
    () =>
      [
        editableCompanyName
          ? {
              id: 'preview-company-name',
              label: '企业名称',
              value: editableCompanyName,
              tone: 'neutral' as const
            }
          : null,
        record.companyCode
          ? {
              id: 'preview-company-code',
              label: '统一代码',
              value: record.companyCode,
              tone: 'neutral' as const
            }
          : null,
        hasCompanyInput
          ? {
              id: 'preview-fetch-status',
              label: '资料状态',
              value: '待抓取',
              tone: 'attention' as const
            }
          : null
      ].filter(Boolean) as InterviewInsightItem[],
    [editableCompanyName, hasCompanyInput, record.companyCode]
  );
  const allInsightItems = hasInsightItems ? record.companyInsightItems ?? [] : previewInsightItems;
  const visibleInsightItems = allInsightItems.slice(0, INSIGHT_PREVIEW_COUNT);
  const hasMoreInsightItems = allInsightItems.length > INSIGHT_PREVIEW_COUNT;
  const summaryText =
    summaryExpanded || record.summary.length <= SUMMARY_PREVIEW_LENGTH
      ? record.summary
      : `${record.summary.slice(0, SUMMARY_PREVIEW_LENGTH)}...`;

  const visibleChecklistSections = useMemo(() => {
    const sections = record.questionChecklistSections ?? [];
    const normalizedSections = sections.filter((section) => section.id !== 'profile');

    if (record.questionChecklistStatus !== 'READY') {
      return normalizedSections;
    }

    return normalizedSections.filter((section) => !section.id.startsWith('preset-'));
  }, [record.questionChecklistSections, record.questionChecklistStatus]);

  const allQuestions = useMemo(
    () =>
      visibleChecklistSections.flatMap((section) =>
        section.questions.map((question) => ({
          ...question,
          sectionId: section.id,
          sectionTitle: section.title
        }))
      ),
    [visibleChecklistSections]
  );

  const previewQuestions = allQuestions.slice(0, 2);
  const selectedQuestions = allQuestions.filter((question) => question.selected);
  const pendingQuestions = allQuestions.filter((question) => !question.selected);
  const totalChecklistQuestions = allQuestions.length;
  const activePresetTemplate =
    presetChecklistTemplates.find((item) => item.id === record.templateId) ?? presetChecklistTemplates[0];
  const insightActionLabel = record.questionChecklistStatus === 'READY' ? '再次洞察' : 'AI洞察';

  const visibleQuestions = useMemo(() => {
    if (questionFilter === 'selected') return selectedQuestions;
    if (questionFilter === 'pending') return pendingQuestions;
    return allQuestions;
  }, [allQuestions, pendingQuestions, questionFilter, selectedQuestions]);

  useEffect(() => {
    setEnterpriseInput((record.companyCode ?? '').trim() || editableCompanyName);
  }, [editableCompanyName, record.companyCode, record.id]);

  useEffect(() => {
    setDetailView(initialView);
  }, [initialView, record.id]);

  useEffect(() => {
    setIsGeneratingReport(record.reportStatus === 'GENERATING');
    setHasGeneratedReport(record.reportStatus === 'GENERATED');
  }, [record.id, record.reportStatus]);

  useEffect(() => {
    if (questionFilter === 'selected' && selectedQuestions.length === 0) {
      setQuestionFilter('all');
    }
  }, [questionFilter, selectedQuestions.length]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 2000);
  };

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    onReportStatusChange(record.id, 'GENERATING');
    window.setTimeout(() => {
      setIsGeneratingReport(false);
      setHasGeneratedReport(true);
      onReportStatusChange(record.id, 'GENERATED');
      triggerToast('报告已生成');
    }, 1800);
  };

  const handleSaveEnterpriseInfo = () => {
    const parsed = parseEnterpriseInput(enterpriseInput);
    onUpdateEnterpriseInfo(record.id, parsed.companyName, parsed.companyCode);
    setShowMetaModal(false);
    triggerToast(parsed.companyName || parsed.companyCode ? '信息已保存，开始抓取资料' : '信息已保存');
  };

  const handleFetchInsights = () => {
    if (!hasCompanyInput) {
      setShowMetaModal(true);
      return;
    }

    onFetchCompanyInsights(record.id);
    triggerToast('开始抓取资料');
  };

  const handleGenerateChecklist = () => {
    if (!canRunChecklist) {
      setShowMetaModal(true);
      return;
    }

    onGenerateChecklist(record.id);
    triggerToast('开始生成问题清单');
  };

  const handleToggleQuestion = (question: InterviewChecklistQuestion) => {
    onToggleChecklistQuestion(record.id, question.id);
    triggerToast(question.selected ? '已移出当前清单' : '已加入当前清单');
  };

  const handleSwitchPresetTemplate = (templateId: string, templateTitle: string) => {
    if (templateId === record.templateId && templateTitle === record.templateTitle) {
      setShowPresetModal(false);
      return;
    }

    onSwitchChecklistTemplate(record.id, templateId, templateTitle);
    setShowPresetModal(false);
    triggerToast(`已切换为${templateTitle}`);
  };

  if (detailView === 'insights') {
    return (
      <div className="flex h-full flex-col overflow-hidden bg-[#F5F7FC]">
        <div className="border-b border-slate-100 bg-white/95 px-5 pb-4 pt-12 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <button onClick={() => setDetailView('overview')} className="p-2 -ml-2 text-slate-800 active:scale-90">
              <ChevronLeft size={28} strokeWidth={2.5} />
            </button>
            <div className="text-center">
              <h2 className="text-[17px] font-black text-slate-900">企查查资料</h2>
              <p className="mt-1 text-[10px] font-black text-slate-300">
                {allInsightItems.length > 0 ? `共 ${allInsightItems.length} 项资料` : '资料概览'}
              </p>
            </div>
            <div className="w-8" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {!hasCompanyInput ? (
            <div className="rounded-[24px] border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-[13px] font-bold text-slate-400">
              请先填写企业名称或统一社会信用代码
            </div>
          ) : record.companyInsightStatus === 'FETCHING' ? (
            <div className="space-y-4 rounded-[24px] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-2 text-indigo-500">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-[13px] font-black">企查查资料抓取中</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-indigo-50">
                <div className="h-full w-2/3 rounded-full bg-[linear-gradient(135deg,#4338FF,#6366F1)] animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {allInsightItems.map((item) => (
                <div key={item.id} className="rounded-[24px] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-black text-slate-400">{item.label}</p>
                      <p className="mt-2 text-[14px] leading-6 text-slate-700">{item.value}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ${getInsightTone(item.tone)}`}>
                      {item.tone === 'attention' ? '待处理' : item.tone === 'positive' ? '已抓取' : '线索'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (detailView === 'checklist') {
    return (
      <div className="flex h-full flex-col overflow-hidden bg-[#F5F7FC]">
        <div className="border-b border-slate-100 bg-white/95 px-5 pb-4 pt-12 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <button onClick={() => setDetailView('overview')} className="p-2 -ml-2 text-slate-800 active:scale-90">
              <ChevronLeft size={28} strokeWidth={2.5} />
            </button>
            <div className="text-center">
              <h2 className="text-[17px] font-black text-slate-900">问题清单</h2>
              <p className="mt-1 text-[10px] font-black text-slate-300">
                已加入 {selectedQuestions.length} / 共 {totalChecklistQuestions} 题
              </p>
            </div>
            <div className="w-8" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex gap-2 overflow-x-auto pb-3">
            {[
              { id: 'all', label: `全部 ${allQuestions.length}` },
              { id: 'pending', label: `待添加 ${pendingQuestions.length}` },
              { id: 'selected', label: `已加入 ${selectedQuestions.length}` }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setQuestionFilter(item.id as QuestionFilter)}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-black ${
                  questionFilter === item.id ? 'bg-indigo-500 text-white' : 'bg-white text-slate-500'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {visibleQuestions.map((question) => (
              <div key={question.id} className="rounded-[24px] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] leading-6 text-slate-700">{question.text}</p>
                  </div>
                  <button
                    onClick={() => handleToggleQuestion(question)}
                    className={`shrink-0 rounded-full px-3 py-2 text-[11px] font-black ${
                      question.selected ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-500'
                    }`}
                  >
                    {question.selected ? '已加入' : '加入'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {visibleQuestions.length === 0 && (
            <div className="mt-4 rounded-[22px] border border-dashed border-slate-200 px-4 py-8 text-center text-[13px] font-bold text-slate-300">
              当前筛选下暂无问题
            </div>
          )}
        </div>
      </div>
    );
  }

  if (detailView === 'recording') {
    return (
      <div className="flex h-full flex-col overflow-hidden bg-[#F5F7FC]">
        <div className="border-b border-slate-100 bg-white/95 px-5 pb-4 pt-12 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <button onClick={() => setDetailView('overview')} className="p-2 -ml-2 text-slate-800 active:scale-90">
              <ChevronLeft size={28} strokeWidth={2.5} />
            </button>
            <div className="text-center">
              <h2 className="text-[17px] font-black text-slate-900">访谈录音</h2>
              <p className="mt-1 text-[10px] font-black text-slate-300">
                {record.interviewName || record.company}
              </p>
            </div>
            <div className="w-8" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="rounded-[30px] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-black text-slate-900">录音文件</h3>
                <p className="mt-1 text-[12px] font-medium text-slate-400">共 {recordingAssets.length} 段录音</p>
              </div>
              <button className="rounded-full bg-indigo-500 px-4 py-2 text-[12px] font-black text-white shadow-lg shadow-indigo-100 active:scale-95">
                开始录音
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {recordingAssets.length > 0 ? (
                recordingAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center gap-3 rounded-[22px] bg-slate-50 px-4 py-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
                      <Mic size={20} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-black text-slate-700">{asset.name}</p>
                      <p className="mt-1 text-[11px] font-medium text-slate-400">点击可查看转写与摘要</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-white text-indigo-500 shadow-sm">
                    <Mic size={28} strokeWidth={2.5} />
                  </div>
                  <p className="mt-4 text-[14px] font-black text-slate-600">暂无访谈录音</p>
                  <p className="mt-2 text-[12px] leading-5 text-slate-400">录音后可在这里查看音频、转写和访谈摘要</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#F5F7FC]">
      <div className="absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_top,_rgba(95,114,255,0.22),_transparent_60%)]" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="px-5 pt-12">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="p-2 -ml-2 text-slate-800 active:scale-90">
              <ChevronLeft size={28} strokeWidth={2.5} />
            </button>
            <div className="flex items-center gap-2">
              <h2 className="max-w-[240px] truncate text-[18px] font-black text-slate-900">
                {record.interviewName || record.company}
              </h2>
              <button onClick={() => setShowMetaModal(true)} className="text-slate-400 active:scale-95">
                <Edit3 size={18} />
              </button>
            </div>
            <div className="w-8" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-8 pt-6">
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(243,241,255,0.96))] p-5 shadow-[0_20px_60px_rgba(96,104,192,0.12)]">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-[26px] bg-[linear-gradient(135deg,#EEF2FF,#FFFFFF)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                  <div className="relative">
                    <div className="text-[42px]">📋</div>
                    <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#74E0B8,#57C2FF)] text-white shadow-lg">
                      <CheckCircle2 size={20} strokeWidth={3} />
                    </div>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-black text-slate-900">{hasGeneratedReport ? '报告已生成' : '报告生成'}</p>
                  <p className="mt-2 text-[14px] leading-6 text-slate-500">
                    {hasGeneratedReport ? '访谈即报告，小狸智能捕捉核心洞察' : '整理资料与访谈内容，生成结构化报告'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleGenerateReport}
                className="mt-5 flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[linear-gradient(135deg,#4338FF,#4F46E5)] text-[15px] font-black text-white shadow-[0_18px_40px_rgba(79,70,229,0.3)] active:scale-[0.99]"
              >
                {isGeneratingReport ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} />}
                <span>{isGeneratingReport ? '生成中...' : '立即生成报告'}</span>
              </button>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: '预览报告', icon: Eye },
                  { label: '立即下载', icon: Download },
                  { label: '更换模板', icon: Edit3 }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => triggerToast(item.label)}
                      className="flex flex-col items-center justify-center gap-3 rounded-[24px] bg-white px-3 py-5 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)] active:scale-[0.98]"
                    >
                      <Icon size={22} />
                      <span className="text-[12px] font-black">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[28px] bg-white px-5 py-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-[16px] font-black text-slate-900">访谈小总结</h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-slate-400">
                    自动提炼
                  </span>
                </div>
                <button
                  onClick={() => setSummaryExpanded((prev) => !prev)}
                  className="rounded-full bg-indigo-50 px-3 py-1.5 text-[11px] font-black text-indigo-500 active:scale-95"
                >
                  {summaryExpanded ? '收起' : '展开'}
                </button>
              </div>
              <p className="mt-4 text-[15px] leading-8 text-slate-700">{summaryText}</p>
            </div>

            <div className="rounded-[28px] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-[16px] font-black text-slate-900">尽调资料</h3>
                  <span className="text-[16px] font-black text-slate-400">({uploadedAssets.length})</span>
                </div>
                <button className="rounded-full border-2 border-indigo-500 px-4 py-1.5 text-[12px] font-black text-indigo-500 active:scale-95">
                  +立即添加
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {uploadedAssets.length > 0 ? (
                  uploadedAssets.slice(0, 3).map((asset) => <AssetRow key={asset.id} asset={asset} />)
                ) : (
                  <div className="rounded-[22px] border border-dashed border-slate-200 px-4 py-6 text-center text-[13px] font-bold text-slate-300">
                    暂无尽调资料
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-[16px] font-black text-slate-900">访谈录音</h3>
                  <span className="text-[16px] font-black text-slate-400">(0)</span>
                </div>
                <button
                  onClick={() => setDetailView('recording')}
                  className="rounded-full border-2 border-indigo-500 px-4 py-1.5 text-[12px] font-black text-indigo-500 active:scale-95"
                >
                  +访谈录音
                </button>
              </div>

              <button
                type="button"
                onClick={() => setDetailView('recording')}
                className="mt-5 flex w-full items-center justify-center rounded-[22px] border border-dashed border-slate-200 px-4 py-6 text-[13px] font-bold text-slate-300 active:scale-[0.99]"
              >
                <Mic size={18} className="mr-2" />
                暂无访谈录音
              </button>
            </div>

            <div className="rounded-[28px] bg-white p-5 text-left shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-[16px] font-black text-slate-900">企查查资料</h3>
                  <span className="text-[16px] font-black text-slate-300">
                    {hasCompanyInput
                      ? record.companyInsightStatus === 'READY' && hasInsightItems
                        ? `${(record.companyInsightItems ?? []).length}项`
                        : record.companyInsightStatus === 'FETCHING'
                          ? '抓取中'
                          : '待抓取'
                      : ''}
                  </span>
                </div>
                {hasCompanyInput ? (
                  record.companyInsightStatus === 'FETCHING' ? (
                    <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-[11px] font-black text-indigo-500">
                      <Loader2 size={14} className="animate-spin" />
                      抓取中
                    </div>
                  ) : (
                    <button
                      onClick={handleFetchInsights}
                      className="rounded-full border-2 border-indigo-500 px-4 py-1.5 text-[12px] font-black text-indigo-500 active:scale-95"
                    >
                      {hasInsightItems ? '更新资料' : '抓取资料'}
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => setShowMetaModal(true)}
                    className="rounded-full border-2 border-slate-200 px-4 py-1.5 text-[12px] font-black text-slate-500 active:scale-95"
                  >
                    填写信息
                  </button>
                )}
              </div>

              <div className="mt-5">
                {!hasCompanyInput ? (
                  <button
                    onClick={() => setShowMetaModal(true)}
                    className="flex w-full items-center justify-between rounded-[22px] border border-dashed border-slate-200 px-4 py-4 text-left text-[13px] font-black text-slate-500 active:scale-[0.99]"
                  >
                    <span>填写企业名称或统一社会信用代码后查看企查查资料</span>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                ) : record.companyInsightStatus === 'FETCHING' ? (
                  <div className="space-y-4 rounded-[22px] bg-indigo-50 px-4 py-4">
                    <div className="flex items-center gap-2 text-indigo-500">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-[12px] font-black">企查查资料抓取中</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white">
                      <div className="h-full w-2/3 rounded-full bg-[linear-gradient(135deg,#4338FF,#6366F1)] animate-pulse" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {visibleInsightItems.map((item) => (
                        <div key={item.id} className="rounded-[18px] bg-slate-50 px-3 py-3">
                          <p className="text-[10px] font-black text-slate-400">{item.label}</p>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <p className="min-w-0 flex-1 text-[12px] font-black text-slate-700">{item.value}</p>
                            <span className={`rounded-full px-2 py-1 text-[9px] font-black ${getInsightTone(item.tone)}`}>
                              {item.tone === 'attention' ? '待抓取' : item.tone === 'positive' ? '已同步' : '线索'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {(hasMoreInsightItems || record.companyInsightStatus === 'READY') && (
                      <button
                        type="button"
                        onClick={() => setDetailView('insights')}
                        className="flex w-full items-center justify-between rounded-[18px] border border-slate-100 px-3 py-3 text-[13px] font-black text-slate-600 active:scale-[0.99]"
                      >
                        <span>查看完整企查查资料</span>
                        <ChevronRight size={18} className="text-slate-300" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                if (record.questionChecklistStatus === 'READY' || totalChecklistQuestions > 0) {
                  setDetailView('checklist');
                  return;
                }

                handleGenerateChecklist();
              }}
              className="w-full rounded-[28px] bg-white p-5 text-left shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition-all active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-black text-slate-900">问题清单</h3>
                    <span className="text-[16px] font-black text-slate-300">
                      {totalChecklistQuestions > 0 ? `${selectedQuestions.length}/${totalChecklistQuestions}` : ''}
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] font-black text-slate-400">
                    当前问题清单：{record.templateTitle || activePresetTemplate.title}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setShowPresetModal(true);
                  }}
                  className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] font-black text-slate-600 active:scale-95"
                >
                  切换清单
                </button>
                {record.questionChecklistStatus === 'GENERATING' ? (
                  <div className="flex flex-1 items-center justify-center gap-2 rounded-full bg-indigo-50 px-4 py-3 text-[12px] font-black text-indigo-500">
                    <Loader2 size={14} className="animate-spin" />
                    生成中
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleGenerateChecklist();
                    }}
                    className="flex-1 rounded-full bg-[linear-gradient(135deg,#4338FF,#4F46E5)] px-4 py-3 text-[12px] font-black text-white shadow-[0_12px_24px_rgba(79,70,229,0.22)] active:scale-95"
                  >
                    {insightActionLabel}
                  </button>
                )}
              </div>

              <div className="mt-5">
                {record.questionChecklistStatus === 'GENERATING' ? (
                  <div className="space-y-4 rounded-[22px] bg-indigo-50 px-4 py-4">
                    <div className="flex items-center gap-2 text-indigo-500">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-[12px] font-black">问题清单生成中</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white">
                      <div className="h-full w-2/3 rounded-full bg-[linear-gradient(135deg,#4338FF,#6366F1)] animate-pulse" />
                    </div>
                  </div>
                ) : totalChecklistQuestions > 0 ? (
                  <div className="space-y-3">
                    {previewQuestions.map((question) => (
                      <div key={question.id} className="rounded-[22px] bg-slate-50 px-4 py-4">
                        <p className="text-[13px] leading-6 text-slate-700">{question.text}</p>
                      </div>
                    ))}

                    <div className="flex items-center justify-between rounded-[22px] border border-slate-100 px-4 py-4 text-[13px] font-black text-slate-600">
                      <span>{record.questionChecklistStatus === 'READY' ? '点击查看 AI 洞察生成的完整问题' : '点击查看完整问题清单'}</span>
                      <ChevronRight size={18} className="text-slate-300" />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[22px] border border-dashed border-slate-200 px-4 py-6 text-[13px] font-black text-slate-500">
                    {canRunChecklist ? '点击 AI洞察 生成补充问题' : '填写企业名称或统一社会信用代码，或上传尽调资料后再生成'}
                  </div>
                )}
              </div>
            </button>

            {hasGeneratedReport && (
              <button
                onClick={() => {
                  triggerToast('归档成功');
                  window.setTimeout(onArchive, 800);
                }}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-[24px] bg-slate-900 text-[14px] font-black text-white shadow-xl active:scale-[0.99]"
              >
                <Archive size={18} className="text-emerald-400" />
                <span>任务归档</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {showMetaModal && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center p-4">
          <button
            onClick={() => setShowMetaModal(false)}
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]"
            aria-label="关闭"
          />
          <div className="relative w-full max-w-md rounded-[32px] bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-black text-slate-900">企业信息</h3>
              <button onClick={() => setShowMetaModal(false)} className="rounded-full bg-slate-100 p-2 text-slate-400 active:scale-95">
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 space-y-2">
              <label className="ml-1 text-[12px] font-black text-slate-600">企业名称 / 统一社会信用代码</label>
              <input
                type="text"
                value={enterpriseInput}
                onChange={(event) => setEnterpriseInput(event.target.value)}
                placeholder="请输入企业名称或统一社会信用代码"
                className="h-12 w-full rounded-2xl bg-slate-50 px-4 text-[14px] font-medium text-slate-800 outline-none"
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowMetaModal(false)}
                className="h-12 rounded-full bg-slate-100 text-[13px] font-black text-slate-500 active:scale-[0.99]"
              >
                取消
              </button>
              <button
                onClick={handleSaveEnterpriseInfo}
                className="h-12 rounded-full bg-[linear-gradient(135deg,#4338FF,#4F46E5)] text-[13px] font-black text-white active:scale-[0.99]"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {showPresetModal && (
        <div className="fixed inset-0 z-[125] flex items-end justify-center p-4">
          <button
            onClick={() => setShowPresetModal(false)}
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]"
            aria-label="关闭"
          />
          <div className="relative w-full max-w-md rounded-[32px] bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-black text-slate-900">切换清单</h3>
                <p className="mt-1 text-[12px] font-black text-slate-300">切换后会替换预设问题，已生成的补充问题会遗失</p>
              </div>
              <button onClick={() => setShowPresetModal(false)} className="rounded-full bg-slate-100 p-2 text-slate-400 active:scale-95">
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {presetChecklistTemplates.map((template) => {
                const isActive = template.id === record.templateId;

                return (
                  <button
                    key={template.id}
                    onClick={() => handleSwitchPresetTemplate(template.id, template.title)}
                    className={`flex w-full items-start justify-between rounded-[24px] border px-4 py-4 text-left transition-all ${
                      isActive ? 'border-indigo-200 bg-indigo-50' : 'border-slate-100 bg-white'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-black text-slate-800">{template.title}</p>
                      <p className="mt-1 text-[12px] leading-5 text-slate-400">{template.desc}</p>
                    </div>
                    <div className="ml-3 flex items-center gap-2">
                      <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-slate-400">
                        {template.questionCount}题
                      </span>
                      {isActive && (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-white">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed left-1/2 top-24 z-[140] -translate-x-1/2">
          <div className="rounded-full bg-slate-900 px-5 py-3 text-[12px] font-black text-white shadow-2xl">
            {toastMsg}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewDetail;
