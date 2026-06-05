import React, { useMemo, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  FileText,
  Layers
} from 'lucide-react';
import { UploadedAsset } from '../types';
import { presetChecklistTemplates } from '../utils/interviewChecklist';

export interface CreateInterviewPayload {
  interviewName: string;
  companyName: string;
  companyCode: string;
  description: string;
  templateId: string;
  templateTitle: string;
  uploadedAssets: UploadedAsset[];
  startImmediately: boolean;
}

interface NewInterviewProps {
  onCreateInterview: (payload: CreateInterviewPayload) => void;
  onCancel: () => void;
}

const templateOptions = presetChecklistTemplates;

const NewInterview: React.FC<NewInterviewProps> = ({ onCreateInterview, onCancel }) => {
  const [drawerView, setDrawerView] = useState<'form' | 'template'>('form');
  const [projectName, setProjectName] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(templateOptions[0].id);

  const selectedTemplate = useMemo(
    () => templateOptions.find((item) => item.id === selectedTemplateId) ?? templateOptions[0],
    [selectedTemplateId]
  );

  const handleCreate = () => {
    if (!projectName.trim()) return;

    onCreateInterview({
      interviewName: projectName.trim(),
      companyName: companyInput.trim(),
      companyCode: '',
      description: description.trim(),
      templateId: selectedTemplate.id,
      templateTitle: selectedTemplate.title,
      uploadedAssets: [],
      startImmediately: false
    });
  };

  return (
    <div className="relative h-full bg-[#F7F8FC]">
      {drawerView === 'form' ? (
      <>
      <div className="h-full overflow-y-auto px-6 pb-28 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="truncate text-[16px] font-semibold text-slate-900">新建报告项目</h2>
          </div>
          <div className="w-6" />
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-[26px] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="ml-1 text-[11px] font-semibold text-slate-600">
                  名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  placeholder="请输入报告项目名称"
                  className="h-11 w-full rounded-2xl bg-slate-50 px-4 text-[13px] font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-[11px] font-semibold text-slate-600">企业名称</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="text"
                    value={companyInput}
                    onChange={(event) => setCompanyInput(event.target.value)}
                    placeholder="可选填"
                    className="h-11 w-full rounded-2xl bg-slate-50 pl-11 pr-4 text-[13px] font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-[11px] font-semibold text-slate-600">模板</label>
                <button
                  type="button"
                  onClick={() => setDrawerView('template')}
                  className="flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-left active:scale-[0.99]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-500">
                      <Layers size={16} strokeWidth={2.3} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-slate-800">{selectedTemplate.title}</p>
                    </div>
                  </div>
                  <ChevronRight size={17} className="shrink-0 text-slate-300" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-[11px] font-semibold text-slate-600">描述</label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="补充项目背景、客户诉求或报告目标"
                  className="min-h-[88px] w-full resize-none rounded-2xl bg-slate-50 px-4 py-3 text-[13px] font-medium leading-6 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-[#F7F8FC] via-[#F7F8FC]/95 to-transparent px-6 pb-5 pt-4">
        <button
          onClick={handleCreate}
          disabled={!projectName.trim()}
          className="h-12 w-full rounded-full bg-indigo-500 text-[13px] font-semibold text-white shadow-lg shadow-indigo-100 active:scale-[0.99] disabled:bg-slate-300 disabled:shadow-none"
        >
          新建
        </button>
      </div>
      </>
      ) : (
      <div className="h-full overflow-y-auto px-6 pb-8 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="truncate text-[16px] font-semibold text-slate-900">选择报告模板</h2>
          <button
            type="button"
            onClick={() => setDrawerView('form')}
            className="text-[12px] font-semibold text-slate-400 active:scale-95"
          >
            取消
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {templateOptions.map((template) => {
            const selected = template.id === selectedTemplateId;

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => {
                  setSelectedTemplateId(template.id);
                  setDrawerView('form');
                }}
                className={`flex w-full items-start justify-between gap-4 rounded-[22px] border px-4 py-4 text-left transition-all ${
                  selected
                    ? 'border-indigo-200 bg-indigo-50'
                    : 'border-slate-100 bg-white'
                }`}
              >
                <div className="flex min-w-0 gap-3">
                  <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${
                    selected ? 'bg-white text-indigo-500' : 'bg-slate-50 text-slate-400'
                  }`}>
                    <FileText size={17} strokeWidth={2.3} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-slate-800">{template.title}</p>
                    <p className="mt-1 text-[11px] leading-5 text-slate-400">{template.desc}</p>
                  </div>
                </div>
                {selected && <CheckCircle2 size={18} className="mt-1 shrink-0 text-indigo-500" />}
              </button>
            );
          })}
        </div>
      </div>
      )}
    </div>
  );
};

export default NewInterview;
