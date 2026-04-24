import React, { useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  MessageSquareText,
  Mic,
  Plus,
  Trash2,
  Upload,
  Sparkles,
  X
} from 'lucide-react';

type ManagementTab = 'templates' | 'questions';
type QuestionView = 'list' | 'detail';

interface TemplateItem {
  id: string;
  title: string;
  subtitle: string;
  updatedAt: string;
  status: 'READY' | 'PROCESSING';
}

interface QuestionSet {
  id: string;
  title: string;
  desc: string;
  questions: string[];
  linkedTemplate?: string;
  uploadedFiles?: string[];
}

interface CreateQuestionSetDraft {
  title: string;
  desc: string;
}

const templates: TemplateItem[] = [
  {
    id: 't1',
    title: '授权调查报告',
    subtitle: '适用于授权核验与基础尽调',
    updatedAt: '今天更新',
    status: 'READY'
  },
  {
    id: 't2',
    title: '不良债权尽职调查报告',
    subtitle: '适用于不良资产与债权核查',
    updatedAt: '昨天更新',
    status: 'READY'
  },
  {
    id: 't3',
    title: '企业经营风险排查报告',
    subtitle: '适用于贷前经营风险评估',
    updatedAt: '处理中',
    status: 'PROCESSING'
  }
];

const initialQuestionSets: QuestionSet[] = [
  {
    id: 'q1',
    title: '授权核验',
    desc: '首轮沟通时快速确认主体信息和授权链路。',
    linkedTemplate: '授权调查报告',
    uploadedFiles: ['授权链路说明.docx'],
    questions: [
      '本次授权的签署主体和实际使用主体是否一致？',
      '授权有效期从什么时候开始，到什么时候结束？',
      '目前是否存在需要补充证明材料的环节？'
    ]
  },
  {
    id: 'q2',
    title: '债权尽调',
    desc: '用于确认债权真实性、时效性和相关风险点。',
    linkedTemplate: '不良债权尽职调查报告',
    uploadedFiles: ['债权底稿清单.xlsx', '历史诉讼摘录.pdf'],
    questions: [
      '债权形成的核心交易背景是什么？',
      '当前债务方的还款能力和意愿如何？',
      '是否存在诉讼、仲裁或资产保全记录？'
    ]
  },
  {
    id: 'q3',
    title: '经营风险',
    desc: '针对企业持续经营能力做基础摸排。',
    linkedTemplate: '企业经营风险排查报告',
    uploadedFiles: [],
    questions: [
      '最近 12 个月的主营收入变化趋势如何？',
      '关键客户或关键供应商是否过于集中？'
    ]
  }
];

const templateQuestionPresets: Record<string, string[]> = {
  授权调查报告: [
    '授权签署主体与实际执行主体是否一致？',
    '授权文件是否覆盖本次调查所需的全部权限范围？',
    '授权链条中是否存在待补充的证明材料？'
  ],
  不良债权尽职调查报告: [
    '债权形成的原始交易背景是否清晰完整？',
    '债务人的当前偿债能力和回款来源如何？',
    '是否存在诉讼、仲裁、查封或保全等风险事项？'
  ],
  企业经营风险排查报告: [
    '最近 12 个月主营收入与毛利率变化趋势如何？',
    '关键客户、关键供应商是否存在集中度过高的问题？',
    '当前经营中最需要重点关注的风险点是什么？'
  ]
};

const initialCreateQuestionSetDraft: CreateQuestionSetDraft = {
  title: '',
  desc: ''
};

const Management: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ManagementTab>('templates');
  const [questionView, setQuestionView] = useState<QuestionView>('list');
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>(initialQuestionSets);
  const [activeQuestionSetId, setActiveQuestionSetId] = useState<string>(initialQuestionSets[0].id);
  const [newQuestionInput, setNewQuestionInput] = useState('');
  const [questionSetTitleDraft, setQuestionSetTitleDraft] = useState(initialQuestionSets[0].title);
  const [questionSetDescDraft, setQuestionSetDescDraft] = useState(initialQuestionSets[0].desc);
  const [showCreateQuestionSetModal, setShowCreateQuestionSetModal] = useState(false);
  const [showQuestionSetMetaModal, setShowQuestionSetMetaModal] = useState(false);
  const [createQuestionSetDraft, setCreateQuestionSetDraft] = useState<CreateQuestionSetDraft>(initialCreateQuestionSetDraft);

  const activeQuestionSet =
    questionSets.find((set) => set.id === activeQuestionSetId) ?? questionSets[0] ?? null;

  useEffect(() => {
    if (!activeQuestionSet) return;

    setQuestionSetTitleDraft(activeQuestionSet.title);
    setQuestionSetDescDraft(activeQuestionSet.desc);
  }, [activeQuestionSet]);

  const updateActiveQuestionSet = (updater: (set: QuestionSet) => QuestionSet) => {
    if (!activeQuestionSet) return;

    setQuestionSets((prev) =>
      prev.map((set) => (set.id === activeQuestionSet.id ? updater(set) : set))
    );
  };

  const openCreateQuestionSetModal = () => {
    setShowCreateQuestionSetModal(true);
    setCreateQuestionSetDraft(initialCreateQuestionSetDraft);
  };

  const closeCreateQuestionSetModal = () => {
    setShowCreateQuestionSetModal(false);
    setCreateQuestionSetDraft(initialCreateQuestionSetDraft);
  };

  const finalizeCreateQuestionSet = (draft: CreateQuestionSetDraft) => {
    const nextIndex = questionSets.length + 1;
    const newSet: QuestionSet = {
      id: `q${Date.now()}`,
      title: draft.title.trim() || `新问题清单 ${nextIndex}`,
      desc: draft.desc.trim(),
      questions: []
    };

    setQuestionSets((prev) => [newSet, ...prev]);
    setActiveQuestionSetId(newSet.id);
    setActiveTab('questions');
    setQuestionView('detail');
    setQuestionSetTitleDraft(newSet.title);
    setQuestionSetDescDraft(newSet.desc);
    setNewQuestionInput('');
    closeCreateQuestionSetModal();
  };

  const handleSubmitCreateQuestionSet = () => {
    const draft = {
      ...createQuestionSetDraft,
      title: createQuestionSetDraft.title.trim(),
      desc: createQuestionSetDraft.desc.trim()
    };

    if (!draft.title) return;

    finalizeCreateQuestionSet(draft);
  };

  const handleAddQuestion = () => {
    const question = newQuestionInput.trim();
    if (!question) return;

    if (!activeQuestionSet) return;

    updateActiveQuestionSet((set) => ({
      ...set,
      questions: [...set.questions, question]
    }));
    setNewQuestionInput('');
  };

  const handleDeleteQuestion = (index: number) => {
    updateActiveQuestionSet((set) => ({
      ...set,
      questions: set.questions.filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const handleConfirmQuestionSetInfo = () => {
    if (!activeQuestionSet) return;

    updateActiveQuestionSet((set) => ({
      ...set,
      title: questionSetTitleDraft.trim() || set.title,
      desc: questionSetDescDraft.trim()
    }));
    setShowQuestionSetMetaModal(false);
  };

  const openQuestionSetMetaModal = () => {
    if (!activeQuestionSet) return;

    setQuestionSetTitleDraft(activeQuestionSet.title);
    setQuestionSetDescDraft(activeQuestionSet.desc);
    setShowQuestionSetMetaModal(true);
  };

  const renderTemplates = () => (
    <div className="space-y-4">
      {templates.map((template) => {
        const linkedSet = questionSets.find((set) => set.linkedTemplate === template.title);
        const isReady = template.status === 'READY';

        return (
          <div
            key={template.id}
            className="rounded-[28px] bg-white px-4 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-100">
                  <FileText size={24} />
                </div>
                <div className="pt-1">
                  <h3 className="text-[17px] font-black leading-tight text-slate-900">
                    {template.title}
                  </h3>
                  <p className="mt-1 text-[12px] font-medium text-slate-400">{template.subtitle}</p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-[11px] font-black ${
                  isReady
                    ? 'bg-emerald-50 text-emerald-500'
                    : 'bg-amber-50 text-amber-500'
                }`}
              >
                {isReady ? '已就绪' : '处理中'}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-300">{template.updatedAt}</p>
                <p className="text-[12px] font-bold text-slate-500">
                  {linkedSet ? `已绑定: ${linkedSet.title}` : '未绑定问题清单'}
                </p>
              </div>

              <button
                onClick={() => {
                  if (linkedSet) {
                    setActiveQuestionSetId(linkedSet.id);
                    setActiveTab('questions');
                  }
                }}
                className="flex items-center gap-1 rounded-full border-2 border-indigo-500 px-4 py-2 text-[13px] font-black text-indigo-500 transition-transform active:scale-95 disabled:opacity-40"
                disabled={!linkedSet}
              >
                <span>预览</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderQuestions = () => (
    <div className="space-y-4">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[13px] font-black text-slate-900">{questionView === 'list' ? '全部清单' : '编辑问题清单'}</p>
          </div>
          <div className="flex items-center gap-2">
            {questionView === 'list' && (
              <>
                <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-black text-slate-400 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                  共 {questionSets.length} 份
                </span>
                <button
                  onClick={openCreateQuestionSetModal}
                  className="flex shrink-0 items-center gap-1 rounded-full bg-indigo-500 px-3 py-2 text-[11px] font-black text-white shadow-lg shadow-indigo-100 active:scale-95"
                >
                  <Plus size={13} />
                  <span>新建</span>
                </button>
              </>
            )}
          </div>
        </div>

        {questionView === 'list' && (
        <div className="space-y-3">
          {questionSets.map((set) => {
            const isActive = activeQuestionSetId === set.id;

            return (
              <button
                key={set.id}
                onClick={() => {
                  setActiveQuestionSetId(set.id);
                  setQuestionView('detail');
                }}
                className={`w-full rounded-[24px] border px-4 py-4 text-left transition-all active:scale-[0.99] ${
                  isActive
                    ? 'border-indigo-200 bg-indigo-50 shadow-[0_12px_28px_rgba(99,102,241,0.12)]'
                    : 'border-white bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-black text-slate-900">{set.title}</p>
                      {isActive && (
                        <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black text-indigo-500">
                          当前编辑
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-[11px] leading-5 text-slate-400">
                      {set.desc || '暂未补充适用场景'}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-slate-500">
                        {set.questions.length} 题
                      </span>
                    </div>
                  </div>
                  {isActive ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-indigo-500">
                      <Check size={16} />
                    </div>
                  ) : (
                    <ChevronRight size={18} className="text-slate-200" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
        )}
      </div>

      {questionView === 'detail' && activeQuestionSet && (
        <div className="space-y-4">
          <div className="rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[16px] font-black text-slate-900">{activeQuestionSet.title}</p>
                  <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-black text-indigo-500">
                    {activeQuestionSet.questions.length} 题
                  </span>
                </div>
                <p className="mt-2 text-[12px] leading-5 text-slate-400">
                  {activeQuestionSet.desc || '暂未补充适用场景'}
                </p>
              </div>
              <button
                onClick={openQuestionSetMetaModal}
                className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-black text-slate-500 active:scale-95"
              >
                编辑信息
              </button>
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <div className="rounded-[24px] bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-indigo-500">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="text-[15px] font-black text-slate-900">添加问题</p>
                </div>
              </div>

              <div className="relative mt-4">
                <textarea
                  value={newQuestionInput}
                  onChange={(e) => setNewQuestionInput(e.target.value)}
                  rows={3}
                  className="w-full rounded-[20px] bg-white px-4 py-3 pr-14 text-[14px] font-medium leading-6 text-slate-700 outline-none ring-0 placeholder:text-slate-300"
                  placeholder="例如：客户当前最关心的合规风险是什么？"
                />
                <button
                  type="button"
                  aria-label="语音录入"
                  className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 active:scale-95"
                >
                  <Mic size={16} />
                </button>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAddQuestion}
                  disabled={!newQuestionInput.trim()}
                  className="flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2.5 text-[13px] font-black text-white shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
                >
                  <Plus size={16} strokeWidth={3} />
                  <span>加入当前清单</span>
                </button>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-[15px] font-black text-slate-900">问题列表</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {(activeQuestionSet?.questions ?? []).length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
                  <p className="text-[13px] font-black text-slate-500">还没有问题</p>
                </div>
              ) : (
                (activeQuestionSet?.questions ?? []).map((question, index) => (
                  <div
                    key={`${activeQuestionSet?.id}-${index}`}
                    className="flex items-start justify-between gap-3 rounded-[22px] border border-slate-100 bg-slate-50/70 px-4 py-4 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex gap-3">
                      <span className="mt-0.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-2 text-[11px] font-black text-indigo-500">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-[14px] font-bold leading-6 text-slate-700">{question}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteQuestion(index)}
                      className="mt-0.5 shrink-0 rounded-full bg-white p-2 text-slate-300 transition-colors hover:text-rose-500 active:scale-95"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {showCreateQuestionSetModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div
            onClick={closeCreateQuestionSetModal}
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-[3px]"
          />
          <div className="relative w-full max-w-md rounded-[32px] bg-white p-6 shadow-[0_28px_70px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[20px] font-black text-slate-900">新建问题清单</p>
              </div>
              <button
                onClick={closeCreateQuestionSetModal}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <label className="ml-1 text-[12px] font-black text-slate-600">清单名称 *</label>
                <input
                  type="text"
                  autoFocus
                  value={createQuestionSetDraft.title}
                  onChange={(e) =>
                    setCreateQuestionSetDraft((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="例如：授权核验首轮沟通清单"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[14px] font-medium text-slate-800 outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-[12px] font-black text-slate-600">描述</label>
                <textarea
                  rows={3}
                  value={createQuestionSetDraft.desc}
                  onChange={(e) =>
                    setCreateQuestionSetDraft((prev) => ({ ...prev, desc: e.target.value }))
                  }
                  placeholder="补充这份问题清单的用途说明"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] font-medium leading-6 text-slate-800 outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

            </div>

            <div className="mt-6 flex gap-3 border-t border-slate-100 pt-5">
              <button
                onClick={closeCreateQuestionSetModal}
                className="flex-1 rounded-full bg-slate-100 px-4 py-3 text-[13px] font-black text-slate-500 active:scale-95"
              >
                取消
              </button>
              <button
                onClick={handleSubmitCreateQuestionSet}
                disabled={!createQuestionSetDraft.title.trim()}
                className="flex-1 rounded-full bg-indigo-500 px-4 py-3 text-[13px] font-black text-white shadow-lg shadow-indigo-100 transition-all disabled:bg-slate-300 disabled:shadow-none"
              >
                新建清单
              </button>
            </div>
          </div>
        </div>
      )}

      {showQuestionSetMetaModal && activeQuestionSet && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div
            onClick={() => setShowQuestionSetMetaModal(false)}
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-[3px]"
          />
          <div className="relative w-full max-w-md rounded-[32px] bg-white p-6 shadow-[0_28px_70px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[20px] font-black text-slate-900">编辑清单信息</p>
                <p className="mt-1 text-[12px] font-medium text-slate-400">这里只维护名称和适用场景。</p>
              </div>
              <button
                onClick={() => setShowQuestionSetMetaModal(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <label className="ml-1 text-[12px] font-black text-slate-600">清单名称</label>
                <input
                  type="text"
                  value={questionSetTitleDraft}
                  onChange={(e) => setQuestionSetTitleDraft(e.target.value)}
                  placeholder="请输入清单名称"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-[14px] font-medium text-slate-800 outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-[12px] font-black text-slate-600">适用场景</label>
                <textarea
                  rows={3}
                  value={questionSetDescDraft}
                  onChange={(e) => setQuestionSetDescDraft(e.target.value)}
                  placeholder="补充清单适用场景"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] font-medium leading-6 text-slate-800 outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 border-t border-slate-100 pt-5">
              <button
                onClick={() => setShowQuestionSetMetaModal(false)}
                className="flex-1 rounded-full bg-slate-100 px-4 py-3 text-[13px] font-black text-slate-500 active:scale-95"
              >
                取消
              </button>
              <button
                onClick={handleConfirmQuestionSetInfo}
                disabled={
                  !questionSetTitleDraft.trim() ||
                  (questionSetTitleDraft === activeQuestionSet.title &&
                    questionSetDescDraft === activeQuestionSet.desc)
                }
                className="flex-1 rounded-full bg-indigo-500 px-4 py-3 text-[13px] font-black text-white shadow-lg shadow-indigo-100 transition-all disabled:bg-slate-300 disabled:shadow-none"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  const renderTopTabButton = (tab: ManagementTab, label: string) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`relative pb-3 text-[16px] font-black transition-colors ${
        activeTab === tab ? 'text-slate-900' : 'text-slate-400'
      }`}
    >
      {label}
      {activeTab === tab && (
        <span className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-indigo-500" />
      )}
    </button>
  );

  return (
    <div className="flex h-full flex-col bg-[#F5F7FB] animate-fade-in">
      <div className="sticky top-0 z-20 bg-[#F5F7FB]/95 px-4 pt-12 backdrop-blur-md">
        {activeTab === 'questions' && questionView === 'detail' ? (
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-1 pb-3">
            <button
              onClick={() => setQuestionView('list')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-[0_6px_20px_rgba(15,23,42,0.06)] active:scale-95"
              aria-label="返回"
            >
              <ChevronLeft size={18} />
            </button>
            <p className="flex-1 text-center text-[16px] font-black text-slate-900">问题详情</p>
            <div className="w-10" />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-1 pb-1">
            <div className="flex items-center gap-8">
              {renderTopTabButton('templates', '我的模板')}
              {renderTopTabButton('questions', '问题清单')}
            </div>
            {activeTab === 'templates' ? (
              <button className="mb-2 flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-2 text-[13px] font-bold text-slate-700 shadow-[0_6px_20px_rgba(15,23,42,0.06)] active:scale-95">
                  <Upload size={16} />
                  <span>上传</span>
              </button>
            ) : (
              <div className="mb-2 w-[68px] shrink-0" />
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-32 pt-5">
        {activeTab === 'templates' ? (
          <section>{renderTemplates()}</section>
        ) : (
          <section>{renderQuestions()}</section>
        )}
      </div>
    </div>
  );
};

export default Management;
