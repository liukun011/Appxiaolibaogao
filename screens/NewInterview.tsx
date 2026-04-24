import React, { useMemo, useState } from 'react';
import {
  Building2,
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleMinus,
  FileUp,
  Images,
  Mic,
  PencilLine,
  Upload,
  X
} from 'lucide-react';
import { UploadedAsset, UploadedAssetKind } from '../types';
import { presetChecklistTemplates } from '../utils/interviewChecklist';

export interface CreateInterviewPayload {
  interviewName: string;
  companyName: string;
  companyCode: string;
  templateId: string;
  templateTitle: string;
  uploadedAssets: UploadedAsset[];
  startImmediately: boolean;
}

interface NewInterviewProps {
  onCreateInterview: (payload: CreateInterviewPayload) => void;
}

type WorkspaceTab = 'upload' | 'template' | 'questions';

interface TemplateOption {
  id: string;
  title: string;
  desc: string;
  questionCount: number;
}
const templateOptions: TemplateOption[] = presetChecklistTemplates;

const questionFocusAreas = [
  '企业介绍和产品介绍',
  '股东情况、历史股权变更与权益性投资',
  '法律诉讼和失信情况',
  '股权质押和动产抵押情况',
  '行政和税收处罚（含欠税）'
];

const FileBadge: React.FC<{ kind: UploadedAssetKind }> = ({ kind }) => {
  const styles: Record<UploadedAssetKind, string> = {
    excel: 'bg-emerald-50 text-emerald-500',
    word: 'bg-blue-50 text-blue-500',
    audio: 'bg-violet-50 text-violet-500',
    image: 'bg-amber-50 text-amber-500'
  };

  const label: Record<UploadedAssetKind, string> = {
    excel: 'X',
    word: 'W',
    audio: 'M',
    image: 'P'
  };

  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-black ${styles[kind]}`}>
      {label[kind]}
    </div>
  );
};

const NewInterview: React.FC<NewInterviewProps> = ({ onCreateInterview }) => {
  const [showSetupModal, setShowSetupModal] = useState(true);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('upload');
  const [interviewName, setInterviewName] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(templateOptions[0].id);
  const [uploadedAssets, setUploadedAssets] = useState<UploadedAsset[]>([]);

  const selectedTemplate = useMemo(
    () => templateOptions.find((item) => item.id === selectedTemplateId) ?? templateOptions[0],
    [selectedTemplateId]
  );

  const handleQuickUpload = (kind: UploadedAssetKind) => {
    const baseName = interviewName.trim() || '访谈资料';
    const now = Date.now();
    const extensionMap: Record<UploadedAssetKind, string> = {
      excel: '.xlsx',
      word: '.docx',
      audio: '.m4a',
      image: '.png'
    };

    const nameMap: Record<UploadedAssetKind, string> = {
      excel: `${baseName}补充资料`,
      word: `${baseName}访谈纪要`,
      audio: `${baseName}语音记录`,
      image: `${baseName}现场照片`
    };

    setUploadedAssets((prev) => [
      {
        id: `upload-${now}`,
        name: `${nameMap[kind]}${extensionMap[kind]}`,
        kind
      },
      ...prev
    ]);
  };

  const handleRemoveAsset = (id: string) => {
    setUploadedAssets((prev) => prev.filter((item) => item.id !== id));
  };

  const handleConfirmSetup = () => {
    if (!interviewName.trim()) return;
    setShowSetupModal(false);
  };

  const handleCreate = (startImmediately: boolean) => {
    if (!interviewName.trim()) return;
    const normalizedInput = companyInput.trim();
    const isCompanyCode = /^[0-9A-Z]{18}$/.test(normalizedInput);

    onCreateInterview({
      interviewName: interviewName.trim(),
      companyName: isCompanyCode ? '' : normalizedInput,
      companyCode: isCompanyCode ? normalizedInput : '',
      templateId: selectedTemplate.id,
      templateTitle: selectedTemplate.title,
      uploadedAssets,
      startImmediately
    });
  };

  return (
    <div className="relative h-full bg-[#F7F8FC]">
      <div className="h-full overflow-y-auto pt-8 pb-36">
        <div className="px-6">
          <div className="flex items-center justify-between">
            <div className="w-6" />
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-black text-slate-900">{interviewName.trim() || '新建访谈'}</h2>
              <button onClick={() => setShowSetupModal(true)} className="text-slate-300 active:scale-95">
                <PencilLine size={16} />
              </button>
            </div>
            <div className="w-6" />
          </div>

          <div className="mt-6 flex border-b border-slate-100">
            {[
              { id: 'upload', label: '资料上传' },
              { id: 'template', label: '模板选择' },
              { id: 'questions', label: '问题集合' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as WorkspaceTab)}
                className={`relative flex-1 pb-4 text-[14px] font-black ${
                  activeTab === tab.id ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute left-1/2 bottom-0 h-[3px] w-10 -translate-x-1/2 rounded-full bg-indigo-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pt-6">
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div className="rounded-[28px] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-black text-slate-900">资料上传</p>
                </div>
                <span className="rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-black text-slate-400">
                  4 种方式
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: '相机', icon: Camera, kind: 'image' as UploadedAssetKind },
                    { label: '相册', icon: Images, kind: 'image' as UploadedAssetKind },
                    { label: '文件', icon: FileUp, kind: 'word' as UploadedAssetKind },
                    { label: '语音录入', icon: Mic, kind: 'audio' as UploadedAssetKind }
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.label}
                        onClick={() => handleQuickUpload(item.kind)}
                        className="rounded-[22px] bg-slate-50 px-2 py-5 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.08)] active:scale-[0.98]"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <Icon size={28} className="text-slate-700" />
                          <span className="text-[11px] font-black text-slate-600">{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-black text-slate-900">已上传资料</p>
                </div>
                <span className="rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-black text-slate-400">
                  {uploadedAssets.length} 份
                  </span>
                </div>

                {uploadedAssets.length === 0 ? (
                  <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                    <Upload size={18} className="mx-auto text-slate-300" />
                    <p className="mt-3 text-[12px] font-bold text-slate-500">还没有上传资料</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {uploadedAssets.map((asset) => (
                      <div key={asset.id} className="flex items-center gap-3 rounded-[22px] bg-slate-50 px-3 py-3">
                        <FileBadge kind={asset.kind} />
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-[14px] font-black text-slate-700">{asset.name}</p>
                        </div>
                        <button onClick={() => handleRemoveAsset(asset.id)} className="text-indigo-500 active:scale-95">
                          <CircleMinus size={22} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'template' && (
            <div className="space-y-4">
              {templateOptions.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`w-full rounded-[26px] border px-5 py-5 text-left transition-all ${
                    selectedTemplateId === template.id
                      ? 'border-indigo-200 bg-indigo-50 shadow-[0_10px_28px_rgba(99,102,241,0.12)]'
                      : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[15px] font-black text-slate-900">{template.title}</p>
                      <p className="mt-2 text-[12px] leading-5 text-slate-400">{template.desc}</p>
                    </div>
                    {selectedTemplateId === template.id ? (
                      <CheckCircle2 size={20} className="shrink-0 text-indigo-500" />
                    ) : (
                      <ChevronRight size={18} className="shrink-0 text-slate-200" />
                    )}
                  </div>
                  <div className="mt-4">
                    <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-black text-indigo-500">
                      {template.questionCount} 个预设问题
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {questionFocusAreas.map((area) => (
                  <div key={area} className="rounded-[24px] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                    <p className="text-[13px] font-black text-slate-900">{area}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-[#F7F8FC] via-[#F7F8FC]/95 to-transparent px-6 pb-5 pt-4">
        <div className="grid grid-cols-2 gap-4 rounded-[30px] bg-white/92 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur-md">
          <button
            onClick={() => handleCreate(false)}
            className="h-14 rounded-full border-2 border-indigo-500 bg-white text-[14px] font-black text-indigo-500 active:scale-[0.99]"
          >
            确定
          </button>
          <button
            onClick={() => handleCreate(true)}
            className="h-14 rounded-full bg-indigo-500 text-[14px] font-black text-white shadow-lg shadow-indigo-100 active:scale-[0.99]"
          >
            开启访谈
          </button>
        </div>
      </div>

      {showSetupModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/25 backdrop-blur-[3px]" />
          <div className="relative w-full max-w-sm rounded-[30px] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[20px] font-black text-slate-900">新建访谈</p>
                <p className="mt-1 text-[12px] text-slate-400">先录入基础信息，再进入访谈工作台。</p>
              </div>
              <button onClick={() => setShowSetupModal(false)} className="rounded-full bg-slate-100 p-2 text-slate-400 active:scale-95">
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="ml-1 text-[12px] font-black text-slate-600">访谈名称</label>
                <input
                  type="text"
                  value={interviewName}
                  onChange={(e) => setInterviewName(e.target.value)}
                  placeholder="例如：贵州省云上金服授信访谈"
                  className="h-12 w-full rounded-2xl bg-slate-50 px-4 text-[14px] font-medium text-slate-800 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-[12px] font-black text-slate-600">企业名称 / 统一社会信用代码</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="text"
                    value={companyInput}
                    onChange={(e) => setCompanyInput(e.target.value.toUpperCase())}
                    placeholder="可选填"
                    className="h-12 w-full rounded-2xl bg-slate-50 pl-11 pr-4 text-[14px] font-medium text-slate-800 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowSetupModal(false)}
                className="h-12 rounded-full bg-slate-100 text-[13px] font-black text-slate-500 active:scale-[0.99]"
              >
                取消
              </button>
              <button
                onClick={handleConfirmSetup}
                disabled={!interviewName.trim()}
                className="h-12 rounded-full bg-indigo-500 text-[13px] font-black text-white shadow-lg shadow-indigo-100 disabled:bg-slate-300 disabled:shadow-none active:scale-[0.99]"
              >
                下一步
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewInterview;
